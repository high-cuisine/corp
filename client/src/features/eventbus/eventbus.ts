import mitt from "mitt";

type Events = { 
    toast: {
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
        duration?: number;
    }
}

const eventBus = mitt<Events>();

export default eventBus;