import 'package:flutter/material.dart';

import 'models.dart';
import 'storage.dart';

class AdminQuestionsPage extends StatefulWidget {
  final Color themeColor;
  const AdminQuestionsPage({super.key, required this.themeColor});

  @override
  State<AdminQuestionsPage> createState() => _AdminQuestionsPageState();
}

class _AdminQuestionsPageState extends State<AdminQuestionsPage> {
  final Map<String, TextEditingController> _answerControllers =
      <String, TextEditingController>{};
  List<StreamQuestion> _questions = <StreamQuestion>[];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  @override
  void dispose() {
    for (final controller in _answerControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> _loadQuestions() async {
    final questions = await AdminStorage.loadQuestions();
    if (!mounted) return;
    setState(() {
      _questions = questions;
      _loading = false;
    });
  }

  Widget _buildGroupedQuestions() {
    final grouped = <String, List<StreamQuestion>>{};
    for (final q in _questions) {
      final key = q.sessionTitle ?? 'General';
      grouped.putIfAbsent(key, () => []).add(q);
    }
    final keys = grouped.keys.toList()
      ..sort((a, b) {
        if (a == 'General') return 1;
        if (b == 'General') return -1;
        return a.compareTo(b);
      });

    return ListView(
      children: keys.map((sessionKey) {
        final items = grouped[sessionKey]!;
        final presGrouped = <String, List<StreamQuestion>>{};
        for (final q in items) {
          final pk = q.presentationTitle ?? '';
          presGrouped.putIfAbsent(pk, () => []).add(q);
        }
        final presKeys = presGrouped.keys.toList();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  Icon(Icons.schedule, size: 16, color: widget.themeColor),
                  const SizedBox(width: 6),
                  Text(
                    sessionKey,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: widget.themeColor,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '${items.length} question${items.length != 1 ? 's' : ''}',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
            ...presKeys.map((presKey) {
              final presItems = presGrouped[presKey]!;
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (presKey.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(left: 16, bottom: 4),
                      child: Text(
                        presKey,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[600],
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                  ...presItems.map((question) {
                    final controller = _controllerFor(question.id);
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Row(
                                children: <Widget>[
                                  Chip(
                                    label: Text(question.author),
                                    backgroundColor: widget.themeColor
                                        .withValues(alpha: 0.12),
                                  ),
                                  const SizedBox(width: 8),
                                  Chip(
                                    label: Text(question.isAnswered
                                        ? 'Answered'
                                        : 'Pending'),
                                    backgroundColor: question.isAnswered
                                        ? Colors.green.withValues(alpha: 0.15)
                                        : Colors.orange.withValues(alpha: 0.2),
                                  ),
                                  const Spacer(),
                                  IconButton(
                                    onPressed: () => _delete(question.id),
                                    icon:
                                        const Icon(Icons.delete_outline),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                question.message,
                                style: const TextStyle(fontSize: 15),
                              ),
                              if (question.isAnswered &&
                                  question.answer != null &&
                                  question.answer!.trim().isNotEmpty)
                                ...<Widget>[
                                  const SizedBox(height: 10),
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.green
                                          .withValues(alpha: 0.08),
                                      borderRadius:
                                          BorderRadius.circular(14),
                                      border: Border.all(
                                        color: Colors.green
                                            .withValues(alpha: 0.18),
                                      ),
                                    ),
                                    child: Text(
                                      'Answer: ${question.answer!}',
                                      style:
                                          const TextStyle(height: 1.35),
                                    ),
                                  ),
                                ]
                              else ...<Widget>[
                                const SizedBox(height: 12),
                                TextField(
                                  controller: controller,
                                  minLines: 2,
                                  maxLines: 4,
                                  decoration: _answerDecoration(),
                                ),
                                const SizedBox(height: 10),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: ElevatedButton.icon(
                                    onPressed: () =>
                                        _markAnswered(question),
                                    icon: const Icon(Icons.done),
                                    label: const Text(
                                        'Mark as answered'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: widget.themeColor,
                                      foregroundColor: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              );
            }),
            const Divider(),
          ],
        );
      }).toList(),
    );
  }

  InputDecoration _answerDecoration() {
    return InputDecoration(
      labelText: 'Write an answer',
      prefixIcon: Icon(Icons.edit_outlined, color: widget.themeColor),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide(color: Colors.grey.withValues(alpha: 0.25)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide(color: Colors.grey.withValues(alpha: 0.25)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide(color: widget.themeColor, width: 1.8),
      ),
    );
  }

  TextEditingController _controllerFor(String id) {
    return _answerControllers.putIfAbsent(id, () => TextEditingController());
  }

  Future<void> _markAnswered(StreamQuestion question) async {
    final answer = _controllerFor(question.id).text.trim();
    if (answer.isEmpty) return;

    final updated = _questions.map((item) {
      if (item.id != question.id) return item;
      return item.copyWith(
        isAnswered: true,
        answer: answer,
        answeredAt: DateTime.now(),
      );
    }).toList();

    await AdminStorage.saveQuestions(updated);
    if (!mounted) return;
    setState(() {
      _questions = updated;
      _controllerFor(question.id).clear();
    });
  }

  Future<void> _delete(String id) async {
    final updated = _questions.where((item) => item.id != id).toList();
    await AdminStorage.saveQuestions(updated);
    if (!mounted) return;
    setState(() => _questions = updated);
  }

  @override
  Widget build(BuildContext context) {
    final pending = _questions.where((item) => !item.isAnswered).toList();
    final answered = _questions.where((item) => item.isAnswered).toList();

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: _loading
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.only(top: 100),
                  child: CircularProgressIndicator(),
                ),
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    'Questions Management',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: widget.themeColor,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 10),
                  Card(
                    elevation: 0,
                    color: widget.themeColor.withValues(alpha: 0.08),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: <Widget>[
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: widget.themeColor.withValues(alpha: 0.16),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(
                              Icons.question_answer_outlined,
                              color: widget.themeColor,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Text(
                              'View incoming attendee questions and answer them without losing the clean ElMoultaqa layout.',
                              style: TextStyle(
                                color: Colors.grey[800],
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child:
                            _summaryCard('Pending', pending.length.toString()),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _summaryCard(
                            'Answered', answered.length.toString()),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child:
                            _summaryCard('Total', _questions.length.toString()),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: _questions.isEmpty
                        ? Center(
                            child: Card(
                              elevation: 0,
                              color: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(22),
                                side: BorderSide(
                                  color: Colors.grey.withValues(alpha: 0.12),
                                ),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(24),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: <Widget>[
                                    Container(
                                      width: 56,
                                      height: 56,
                                      decoration: BoxDecoration(
                                        color: widget.themeColor
                                            .withValues(alpha: 0.10),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Icon(
                                        Icons.inbox_outlined,
                                        color: widget.themeColor,
                                      ),
                                    ),
                                    const SizedBox(height: 14),
                                    const Text(
                                      'No stream questions available',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      'When attendees send questions from the live stream, they will appear here.',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        height: 1.35,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          )
                        : _buildGroupedQuestions(),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _summaryCard(String label, String value) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: <Widget>[
            Text(
              value,
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: widget.themeColor,
              ),
            ),
            const SizedBox(height: 6),
            Text(label),
          ],
        ),
      ),
    );
  }
}
