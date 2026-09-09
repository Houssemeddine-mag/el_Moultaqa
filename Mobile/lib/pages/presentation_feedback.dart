import 'package:flutter/material.dart';
import '../mobile_config.dart';
import '../services/supabase_service.dart';

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

  Future<void> _submit() async {
    if (_presenterRating == 0 &&
        _presentationRating == 0 &&
        _commentController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please provide a rating or comment')));
      return;
    }

    final presenterRating = _presenterRating;
    final presentationRating = _presentationRating;
    final comment = _commentController.text.trim();

    try {
      await SupabaseService.submitFeedback({
        'presentation_title': widget.title,
        'presenter_rating': presenterRating,
        'presentation_rating': presentationRating,
        'comment': comment,
      });
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not submit feedback. Please try again.')));
      return;
    }

    if (!mounted) return;
    setState(() {
      _ratings.insert(0, {
        'presenter': presenterRating,
        'presentation': presentationRating,
        'comment': comment,
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
    final themeColor = MobileConfig.parsedThemeColor;

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
