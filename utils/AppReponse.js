class AppResponse {
  constructor(data, lastPage) {
    this.status = "success";
    this.data = data;
    if (lastPage !== null && lastPage !== undefined) {
      this.lastPage = lastPage;
    }
  }
}

export default AppResponse;
