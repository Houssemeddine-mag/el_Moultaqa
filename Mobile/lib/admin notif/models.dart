class AdminNotification {
  final String id;
  final String title;
  final String message;
  final String type;
  final String priority;
  final DateTime createdAt;

  const AdminNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.priority,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'priority': priority,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory AdminNotification.fromMap(Map<String, dynamic> map) {
    return AdminNotification(
      id: (map['id'] ?? '').toString(),
      title: (map['title'] ?? '').toString(),
      message: (map['message'] ?? '').toString(),
      type: (map['type'] ?? 'general').toString(),
      priority: (map['priority'] ?? 'normal').toString(),
      createdAt: DateTime.tryParse((map['createdAt'] ?? '').toString()) ??
          DateTime.now(),
    );
  }
}

class StreamQuestion {
  final String id;
  final String author;
  final String message;
  final DateTime createdAt;
  final bool isAnswered;
  final String? answer;
  final DateTime? answeredAt;

  const StreamQuestion({
    required this.id,
    required this.author,
    required this.message,
    required this.createdAt,
    required this.isAnswered,
    this.answer,
    this.answeredAt,
  });

  StreamQuestion copyWith({
    String? id,
    String? author,
    String? message,
    DateTime? createdAt,
    bool? isAnswered,
    String? answer,
    DateTime? answeredAt,
  }) {
    return StreamQuestion(
      id: id ?? this.id,
      author: author ?? this.author,
      message: message ?? this.message,
      createdAt: createdAt ?? this.createdAt,
      isAnswered: isAnswered ?? this.isAnswered,
      answer: answer ?? this.answer,
      answeredAt: answeredAt ?? this.answeredAt,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'author': author,
      'message': message,
      'createdAt': createdAt.toIso8601String(),
      'isAnswered': isAnswered,
      'answer': answer,
      'answeredAt': answeredAt?.toIso8601String(),
    };
  }

  factory StreamQuestion.fromMap(Map<String, dynamic> map) {
    return StreamQuestion(
      id: (map['id'] ?? '').toString(),
      author: (map['author'] ?? 'Anonymous').toString(),
      message: (map['message'] ?? '').toString(),
      createdAt: DateTime.tryParse((map['createdAt'] ?? '').toString()) ??
          DateTime.now(),
      isAnswered: map['isAnswered'] == true,
      answer: map['answer']?.toString(),
      answeredAt: map['answeredAt'] != null
          ? DateTime.tryParse(map['answeredAt'].toString())
          : null,
    );
  }
}
