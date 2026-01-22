class CoreResponse {
  final bool success;
  final String? error;
  final Map<String, dynamic>? data;

  CoreResponse(this.success, this.error, this.data);

  Map<String, dynamic> toJson() {
    return {"success": success, "error": error, "data": data};
  }
}
