export default class CanvasUndoRedoArray {
    private array: ImageData[];
    private index: number;
    private max: number | undefined;

    // TODO: should these be encapsulated? does it matter?
    public on_can_undo_change: ((can_undo: boolean) => void) | undefined;
    public on_can_redo_change: ((can_redo: boolean) => void) | undefined;

    // store last emitted change event to avoid emitting duplicate events
    private can_undo_cache: boolean | null = null;
    private can_redo_cache: boolean | null = null;

    constructor(max?: number) {
        this.array = [];
        this.index = -1;
        this.max = max;

        // the caller should now push an initial state
    }


    private fire_events() {
        console.log(this.index, this.array);

        // fire change events only if they're different from the cache

        if (this.can_undo_cache !== this.can_undo) {
            this.on_can_undo_change?.(this.can_undo);
            this.can_undo_cache = this.can_undo;
        }

        if (this.can_redo_cache !== this.can_redo) {
            this.on_can_redo_change?.(this.can_redo);
            this.can_redo_cache = this.can_redo;
        }
    }


    public capture(item: ImageData) {
        // the caller will push the canvas state BEFORE the change

        // if hit max, remove the first item to lose a layer of undo (shift array left)
        if (this.max && this.array.length >= this.max) {
            this.array.shift();
            this.index--;
        }

        // if not at the end of the array, remove all items after the current index
        if (this.index < this.array.length - 1) {
            this.array.splice(this.index + 1);
        }
        
        // add the new item to the end of the array
        this.array.push(item);
        this.index++;

        this.fire_events();

        // capture should always be called AFTER any changes are made to the canvas
        // e.g. clear canvas, then capture. don't do what we used to (capture, then clear)
    }

    public capture_from_ctx(ctx: CanvasRenderingContext2D) {
        this.capture(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
    }

    public capture_from_canvas(canvas: HTMLCanvasElement) {
        // TODO: safe?
        this.capture_from_ctx(canvas.getContext("2d")!);
    }

    public undo() {
        if (this.can_undo) {
            this.index--;
            this.fire_events();
            return this.array[this.index];
        }
    }

    public redo() {
        if (this.can_redo) {
            this.index++;
            this.fire_events();
            return this.array[this.index];
        }
    }


    public undo_onto_ctx(ctx: CanvasRenderingContext2D) {
        if (!ctx) return false;

        const item = this.undo();
        if (item) {
            ctx.putImageData(item, 0, 0);
        }

        return true;
    }

    public redo_onto_ctx(ctx: CanvasRenderingContext2D) {
        if (!ctx) return false;

        const item = this.redo();
        if (item) {
            ctx.putImageData(item, 0, 0);
        }

        return true;
    }

    public undo_onto_canvas(canvas: HTMLCanvasElement) {
        if (!canvas) return false;

        const ctx = canvas.getContext("2d")!;
        return this.undo_onto_ctx(ctx);
    }

    public redo_onto_canvas(canvas: HTMLCanvasElement) {
        if (!canvas) return false;

        const ctx = canvas.getContext("2d")!;
        return this.redo_onto_ctx(ctx);
    }


    public get length() {
        return this.array.length;
    }

    public get can_undo() {
        return this.index > 0;
    }

    public get can_redo() {
        return this.index < this.array.length - 1;
    }

    public clear() {
        this.array = [];
        this.index = -1;

        this.fire_events();

        // the caller should now push an initial state
    }
}

// TODO: document
