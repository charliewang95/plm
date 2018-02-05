//sessionId.js
const userId = '5a765f3d9de95bea24f905d9';
//for testing purpose only.
const BACK_DOOR_OPEN = true; //TODO: when deploying, change to false
const READ_FROM_DATABASE = true;
const superId = 'real-producers-root';
//
const sessionId = (BACK_DOOR_OPEN ? superId : userId);

export {sessionId, READ_FROM_DATABASE};
