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

class LiveStream {
  final String id;
  final String name;
  final String url;
  final DateTime createdAt;

  const LiveStream({
    required this.id,
    required this.name,
    required this.url,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'url': url,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory LiveStream.fromMap(Map<String, dynamic> map) {
    return LiveStream(
      id: (map['id'] ?? '').toString(),
      name: (map['name'] ?? '').toString(),
      url: (map['url'] ?? '').toString(),
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
  final String? streamId;
  final String? sessionTitle;
  final String? presentationTitle;

  const StreamQuestion({
    required this.id,
    required this.author,
    required this.message,
    required this.createdAt,
    required this.isAnswered,
    this.answer,
    this.answeredAt,
    this.streamId,
    this.sessionTitle,
    this.presentationTitle,
  });

  StreamQuestion copyWith({
    String? id,
    String? author,
    String? message,
    DateTime? createdAt,
    bool? isAnswered,
    String? answer,
    DateTime? answeredAt,
    String? streamId,
    String? sessionTitle,
    String? presentationTitle,
  }) {
    return StreamQuestion(
      id: id ?? this.id,
      author: author ?? this.author,
      message: message ?? this.message,
      createdAt: createdAt ?? this.createdAt,
      isAnswered: isAnswered ?? this.isAnswered,
      answer: answer ?? this.answer,
      answeredAt: answeredAt ?? this.answeredAt,
      streamId: streamId ?? this.streamId,
      sessionTitle: sessionTitle ?? this.sessionTitle,
      presentationTitle: presentationTitle ?? this.presentationTitle,
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
      'streamId': streamId,
      'sessionTitle': sessionTitle,
      'presentationTitle': presentationTitle,
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
      streamId: map['streamId']?.toString(),
      sessionTitle: map['sessionTitle']?.toString(),
      presentationTitle: map['presentationTitle']?.toString(),
    );
  }
}
