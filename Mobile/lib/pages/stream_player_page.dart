import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../admin notif/models.dart';
import '../admin notif/storage.dart';

class StreamPlayerPage extends StatefulWidget {
  final LiveStream stream;
  final Color themeColor;

  const StreamPlayerPage({
    super.key,
    required this.stream,
    required this.themeColor,
  });

  @override
  State<StreamPlayerPage> createState() => _StreamPlayerPageState();
}

class _StreamPlayerPageState extends State<StreamPlayerPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isFullScreen = false;
  bool _playerReady = false;

  final List<StreamQuestion> _questions = [];
  final TextEditingController _questionController = TextEditingController();
  bool _loadingQuestions = true;

  String? _linkedSessionTitle;
  String? _linkedPresentationTitle;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadQuestions();
    _resolveLinkedSession();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _questionController.dispose();
    if (_isFullScreen) {
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
      SystemChrome.setPreferredOrientations(
          [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
    }
    super.dispose();
  }

  String _extractVideoId(String url) {
    final patterns = [
      RegExp(
          r'(?:youtube\.com/watch\?.*v=|youtu\.be/|youtube\.com/embed/|youtube\.com/live/)([a-zA-Z0-9_-]{11})'),
      RegExp(r'youtube\.com/embed/([a-zA-Z0-9_-]{11})'),
    ];
    for (final pattern in patterns) {
      final match = pattern.firstMatch(url);
      if (match != null && match.group(1) != null) {
        return match.group(1)!;
      }
    }
    return url;
  }

  Future<void> _resolveLinkedSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('elm_webapp_programs');
      if (raw == null || raw.isEmpty) return;

      final decoded = jsonDecode(raw);
      if (decoded is! List) return;

      final now = DateTime.now();

      for (final session in decoded) {
        if (session is! Map) continue;
        final sid = (session['streamId'] ?? '').toString();
        if (sid != widget.stream.id) continue;

        final title = (session['title'] ?? '').toString();
        _linkedSessionTitle = title;

        final conferences = (session['conferences'] as List?)
                ?.whereType<Map>()
                .map((m) => Map<String, dynamic>.from(m))
                .toList() ??
            [];

        for (final pres in conferences) {
          final presStart = (pres['start'] ?? '').toString();
          final presEnd = (pres['end'] ?? '').toString();
          if (presStart.isEmpty || presEnd.isEmpty) continue;

          try {
            final startParts = presStart.split(':');
            final endParts = presEnd.split(':');
            if (startParts.length < 2 || endParts.length < 2) continue;

            final startMin = int.parse(startParts[0]) * 60 + int.parse(startParts[1]);
            final endMin = int.parse(endParts[0]) * 60 + int.parse(endParts[1]);
            final nowMin = now.hour * 60 + now.minute;

            if (nowMin >= startMin && nowMin <= endMin) {
              _linkedPresentationTitle = (pres['title'] ?? '').toString();
              break;
            }
          } catch (_) {}
        }

        break;
      }
    } catch (_) {}
  }

  Future<void> _loadQuestions() async {
    final all = await AdminStorage.loadQuestions();
    if (mounted) {
      setState(() {
        _questions.addAll(all.where((q) => q.streamId == widget.stream.id));
        _loadingQuestions = false;
      });
    }
  }

  Future<void> _submitQuestion() async {
    final text = _questionController.text.trim();
    if (text.isEmpty) return;

    final question = StreamQuestion(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      author: 'Attendee',
      message: text,
      createdAt: DateTime.now(),
      isAnswered: false,
      streamId: widget.stream.id,
      sessionTitle: _linkedSessionTitle,
      presentationTitle: _linkedPresentationTitle,
    );

    final all = await AdminStorage.loadQuestions();
    all.insert(0, question);
    await AdminStorage.saveQuestions(all);

    if (mounted) {
      setState(() {
        _questions.insert(0, question);
        _questionController.clear();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Question sent!'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  void _toggleFullScreen() {
    setState(() => _isFullScreen = !_isFullScreen);

    if (_isFullScreen) {
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
      SystemChrome.setPreferredOrientations([
        DeviceOrientation.landscapeLeft,
        DeviceOrientation.landscapeRight,
      ]);
    } else {
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
      SystemChrome.setPreferredOrientations([
        DeviceOrientation.portraitUp,
        DeviceOrientation.portraitDown,
      ]);
    }
  }

  @override
  Widget build(BuildContext context) {
    final videoId = _extractVideoId(widget.stream.url);
    final embedUrl = Uri.parse(
        'https://www.youtube.com/embed/$videoId?autoplay=1&modestbranding=1&rel=0');

    if (_isFullScreen) {
      return _buildFullScreenPlayer(embedUrl);
    }

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: widget.themeColor),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          widget.stream.name,
          style: TextStyle(
            color: widget.themeColor,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Column(
        children: [
          SizedBox(
            height: 240,
            child: Stack(
              children: [
                WebViewWidget(
                  controller: WebViewController()
                    ..setJavaScriptMode(JavaScriptMode.unrestricted)
                    ..loadRequest(embedUrl)
                    ..setNavigationDelegate(
                      NavigationDelegate(
                        onPageFinished: (_) {
                          if (mounted) {
                            setState(() => _playerReady = true);
                          }
                        },
                      ),
                    ),
                ),
                Positioned(
                  right: 8,
                  top: 8,
                  child: IconButton(
                    icon: const Icon(Icons.fullscreen, color: Colors.white),
                    onPressed: _toggleFullScreen,
                  ),
                ),
                if (!_playerReady)
                  const Center(
                    child: CircularProgressIndicator(color: Colors.white),
                  ),
              ],
            ),
          ),
          TabBar(
            controller: _tabController,
            indicatorColor: widget.themeColor,
            labelColor: widget.themeColor,
            unselectedLabelColor: const Color(0xFF9CA3AF),
            tabs: const [
              Tab(text: 'Stream'),
              Tab(text: 'Questions'),
            ],
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildStreamInfoTab(),
                _buildQuestionsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFullScreenPlayer(Uri embedUrl) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
          _toggleFullScreen();
        }
      },
      child: Scaffold(
        backgroundColor: Colors.black,
        body: SafeArea(
          child: Stack(
            children: [
              WebViewWidget(
                controller: WebViewController()
                  ..setJavaScriptMode(JavaScriptMode.unrestricted)
                  ..loadRequest(embedUrl),
              ),
              Positioned(
                right: 8,
                top: 8,
                child: IconButton(
                  icon: const Icon(Icons.fullscreen_exit, color: Colors.white),
                  onPressed: _toggleFullScreen,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStreamInfoTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.stream.name,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: widget.themeColor,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.circle, size: 8, color: Colors.red),
                    SizedBox(width: 4),
                    Text(
                      'LIVE',
                      style: TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              if (_linkedSessionTitle != null)
                Text(
                  _linkedSessionTitle!,
                  style: TextStyle(color: Colors.grey[600], fontSize: 13),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: widget.themeColor.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Icon(Icons.link, color: widget.themeColor, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    widget.stream.url,
                    style: TextStyle(
                      color: Colors.grey[700],
                      fontSize: 13,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionsTab() {
    return Column(
      children: [
        Expanded(
          child: _loadingQuestions
              ? const Center(child: CircularProgressIndicator())
              : _questions.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.question_answer_outlined,
                              size: 48, color: Colors.grey[400]),
                          const SizedBox(height: 12),
                          Text(
                            'No questions yet',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Ask a question below',
                            style: TextStyle(color: Colors.grey[500]),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _questions.length,
                      separatorBuilder: (_, __) =>
                          const SizedBox(height: 8),
                      itemBuilder: (context, index) {
                        final q = _questions[index];
                        return Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: Colors.grey.withValues(alpha: 0.15),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: widget.themeColor
                                          .withValues(alpha: 0.10),
                                      borderRadius:
                                          BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      q.author,
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: widget.themeColor,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                  const Spacer(),
                                  Text(
                                    _formatTime(q.createdAt),
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Colors.grey[500],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(q.message, style: const TextStyle(fontSize: 14)),
                              if (q.isAnswered &&
                                  q.answer != null &&
                                  q.answer!.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: Colors.green
                                        .withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(Icons.check_circle,
                                          size: 14,
                                          color: Colors.green[700]),
                                      const SizedBox(width: 6),
                                      Expanded(
                                        child: Text(
                                          q.answer!,
                                          style: TextStyle(
                                            fontSize: 13,
                                            color: Colors.green[800],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ],
                          ),
                        );
                      },
                    ),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 8,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: SafeArea(
            top: false,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _questionController,
                    decoration: InputDecoration(
                      hintText: 'Ask a question...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey.withValues(alpha: 0.10),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 12),
                    ),
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _submitQuestion(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: Icon(Icons.send, color: widget.themeColor),
                  onPressed: _submitQuestion,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour.toString().padLeft(2, '0');
    final min = dt.minute.toString().padLeft(2, '0');
    return '$hour:$min';
  }
}
