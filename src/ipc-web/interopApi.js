class WebInteropApi {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        if (typeof prop === 'string' && !target[prop]) {
          return new Proxy({}, {
            get(_, methodName) {
              return async (...args) => {
                return target.callMethod(prop, methodName, ...args);
              };
            }
          });
        }
        return target[prop];
      }
    });
  }

  async callMethod(className, methodName, ...args) {
    const res = await fetch(`${API_BASE_URL}/api/dotnet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ className, methodName, args })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data.result;
  }
}

export default new WebInteropApi();
