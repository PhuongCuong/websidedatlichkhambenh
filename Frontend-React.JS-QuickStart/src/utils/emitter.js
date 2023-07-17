
import EventEmitter from 'events'
import { __esModule } from 'react-auth-wrapper';

const _emitter = new EventEmitter();
_emitter.setMaxListeners(0);

export const emitter = _emitter;