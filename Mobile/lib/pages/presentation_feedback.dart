import 'package:flutter/material.dart';
import '../mobile_config.dart';

class PresentationFeedbackPage extends StatefulWidget {
  final String title;
  const PresentationFeedbackPage({super.key, required this.title});

  @override
  State<PresentationFeedbackPage> createState() =>
      _PresentationFeedbackPageState();
}

class _PresentationFeedbackPageState extends State<PresentationFeedbackPage> {
  double _presenterRating = 0;
  double _presentationRating = 0;
  final TextEditingController _commentController = TextEditingController();
  final List<Map<String, dynamic>> _ratings = [];

  void _submit() {
    if (_presenterRating == 0 &&
        _presentationRating == 0 &&
        _commentController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please provide a rating or comment')));
      return;
    }

    setState(() {
      _ratings.insert(0, {
        'presenter': _presenterRating,
        'presentation': _presentationRating,
        'comment': _commentController.text.trim(),
        'time': DateTime.now(),
      });
      _presenterRating = 0;
      _presentationRating = 0;
      _commentController.clear();
    });

    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Thank you for your feedback')));
  }

  Widget _stars(double value, Function(double) onChanged) {
    return Row(
      children: List.generate(5, (i) {
        final idx = i + 1;
        final filled = idx <= value;
        return IconButton(
          onPressed: () => onChanged(idx.toDouble()),
          icon: Icon(filled ? Icons.star : Icons.star_border,
              color: Colors.amber),
        );
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff${raw.substring(1)}';
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff$raw';
    }
    final themeColor = Color(int.parse(hex));

    return Scaffold(
      appBar: AppBar(
          title: Text(widget.title),
          backgroundColor: Colors.white,
          foregroundColor: themeColor,
          elevation: 0),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Rate the presenter',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    _stars(_presenterRating,
                        (v) => setState(() => _presenterRating = v)),
                    const SizedBox(height: 8),
                    const Text('Rate the presentation',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    _stars(_presentationRating,
                        (v) => setState(() => _presentationRating = v)),
                    const SizedBox(height: 8),
                    TextField(
                        controller: _commentController,
                        maxLines: 3,
                        decoration: const InputDecoration(
                            hintText: 'Add an optional comment')),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        ElevatedButton(
                            onPressed: _submit, child: const Text('Submit')),
                        const SizedBox(width: 12),
                        OutlinedButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Close')),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Align(
                alignment: Alignment.centerLeft,
                child: Text('Recent feedback',
                    style: TextStyle(fontWeight: FontWeight.bold))),
            const SizedBox(height: 8),
            Expanded(
              child: _ratings.isEmpty
                  ? const Center(child: Text('No feedback yet.'))
                  : ListView.builder(
                      itemCount: _ratings.length,
                      itemBuilder: (context, index) {
                        final r = _ratings[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 8),
                          child: ListTile(
                            title: Text(
                                'Presenter: ${r['presenter']} · Presentation: ${r['presentation']}'),
                            subtitle: r['comment'] != null &&
                                    r['comment'].toString().isNotEmpty
                                ? Text(r['comment'])
                                : null,
                            trailing: Text(
                                '${(r['time'] as DateTime).hour}:${(r['time'] as DateTime).minute.toString().padLeft(2, '0')}'),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
