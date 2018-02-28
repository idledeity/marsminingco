/**
 * Context for serialization
 */
export default class SerializationContext {
    public readonly isRead: boolean;
    public bufferObj: object;

    /**
     * Constructor
     */
    constructor(isRead: boolean, bufferObj: object = {}) {
        this.isRead = isRead;
        this.bufferObj = bufferObj;
    }
}