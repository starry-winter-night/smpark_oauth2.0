class Clients {
  constructor(
    public id: string,
    public client_id: string,
    public api_key: string,
    public application_name: string,
    public redirect_uri: string,
    public address_uri: string,
    public grant_type: 'authorization_code' | 'refresh_token',
    public clientAllowedScopes: { id: boolean; email: boolean; name: boolean },
  ) {
    this.id = id;
    this.client_id = client_id;
    this.api_key = api_key;
    this.application_name = application_name;
    this.redirect_uri = redirect_uri;
    this.address_uri = address_uri;
    this.grant_type = grant_type;
    this.clientAllowedScopes = clientAllowedScopes;
  }

  isValidScope(scope: { id: boolean; email: boolean; name: boolean }): boolean {
    if (!scope.id) {
      return false;
    }

    return true;
  }

  isValidURI(url: string): boolean {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|localhost|\\d{1,3}(\\.\\d{1,3}){3})' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );

    return urlPattern.test(url);
  }
}

export default Clients;
