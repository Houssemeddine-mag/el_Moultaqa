import 'package:flutter/material.dart';
import '../mobile_config.dart';
import '../admin notif/models.dart';
import '../admin notif/storage.dart';

class DirectPage extends StatefulWidget {
  const DirectPage({Key? key}) : super(key: key);

  @override
  _DirectPageState createState() => _DirectPageState();
}

class _DirectPageState extends State<DirectPage> {
  bool _isLive = false;
  int _viewerCount = 0;
  final TextEditingController _questionController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  late Color themeColor;

  @override
  void initState() {
    super.initState();
    _checkLiveStatus();
    _loadStreamQuestions();
  }

  Future<void> _loadStreamQuestions() async {
    final questions = await AdminStorage.loadQuestions();
    if (!mounted) return;

    setState(() {
      _messages
        ..clear()
        ..addAll(
          questions.map((q) => <String, dynamic>{
                'author': q.author,
                'message': q.message,
                'time': _formatRelativeTime(q.createdAt),
                'isQuestion': true,
              }),
        );
    });
  }

  String _formatRelativeTime(DateTime dateTime) {
    final diff = DateTime.now().difference(dateTime);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inHours < 1) return '${diff.inMinutes}m ago';
    if (diff.inDays < 1) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }

  void _checkLiveStatus() {
    // Check if stream is currently live from config
    setState(() {
      _isLive = MobileConfig.liveStreamUrl.isNotEmpty;
      _viewerCount = 0; // Start with 0 viewers
      _messages.clear(); // Start with empty chat
    });
  }

  Future<void> _submitQuestion() async {
    if (_questionController.text.isNotEmpty) {
      final message = _questionController.text.trim();

      final existingQuestions = await AdminStorage.loadQuestions();
      final newQuestion = StreamQuestion(
        id: DateTime.now().microsecondsSinceEpoch.toString(),
        author: 'App User',
        message: message,
        createdAt: DateTime.now(),
        isAnswered: false,
      );
      final updatedQuestions = <StreamQuestion>[
        newQuestion,
        ...existingQuestions
      ];
      await AdminStorage.saveQuestions(updatedQuestions);

      if (!mounted) return;
      setState(() {
        _messages.insert(0, {
          'author': 'App User',
          'message': message,
          'time': 'Just now',
          'isQuestion': true,
        });
        _questionController.clear();
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Question submitted!'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff' + raw.substring(1);
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff' + raw;
    }
    themeColor = Color(int.parse(hex));

    // Always render the scaffold so users see the stream placeholder
    // and the question input even when the stream is offline.

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: <Widget>[
            if (_isLive)
              Container(
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Row(
                  children: <Widget>[
                    Icon(Icons.circle, size: 8, color: Colors.white),
                    SizedBox(width: 4),
                    Text(
                      'LIVE',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            Text(
              'Live Stream',
              style: TextStyle(color: themeColor),
            ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: themeColor),
      ),
      body: Column(
        children: <Widget>[
          // Stream Display Area
          Container(
            width: double.infinity,
            height: 220,
            color: Colors.black,
            child: Stack(
              alignment: Alignment.center,
              children: <Widget>[
                // Video player placeholder
                Container(
                  color: Colors.black87,
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.play_circle_outline,
                          size: 64,
                          color: Colors.white.withOpacity(0.7),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Conference Live Stream',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                // Live indicator and viewer count
                Positioned(
                  top: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: <Widget>[
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'LIVE',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Messages/Chat Area
          Expanded(
            child: _messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.chat_bubble_outline,
                          size: 48,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No messages yet',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    reverse: true,
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final message = _messages[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text(
                              message['author'],
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: themeColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: message['isQuestion']
                                    ? themeColor.withOpacity(0.1)
                                    : Colors.grey[200],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Text(message['message']),
                                  const SizedBox(height: 4),
                                  Text(
                                    message['time'],
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
          // Question Input Field
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.grey[300]!),
              ),
              color: Colors.white,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Text(
                  'Ask a Question',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[600],
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: TextField(
                        controller: _questionController,
                        maxLines: 1,
                        decoration: InputDecoration(
                          hintText: 'Type your question here...',
                          hintStyle: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 14,
                          ),
                          prefixIcon: Icon(
                            Icons.help_outline,
                            color: themeColor,
                            size: 20,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide(
                              color: Colors.grey[300]!,
                              width: 1,
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide(
                              color: Colors.grey[300]!,
                              width: 1,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide(
                              color: themeColor,
                              width: 2,
                            ),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      decoration: BoxDecoration(
                        color: themeColor,
                        shape: BoxShape.circle,
                        boxShadow: <BoxShadow>[
                          BoxShadow(
                            color: themeColor.withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: IconButton(
                        icon: const Icon(
                          Icons.send_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                        onPressed: _submitQuestion,
                        tooltip: 'Submit question',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _questionController.dispose();
    super.dispose();
  }
}
