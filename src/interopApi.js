import electronInterop from './ipc-electron/interopApi.js';
import webInterop from './ipc-web/interopApi.js';

const InteropApi = window.interopApi ? electronInterop : webInterop;

export default InteropApi;
