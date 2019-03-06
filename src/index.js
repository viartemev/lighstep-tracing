function traceRemoteRequest(spanName) {
    return function trace(target, name, descriptor) {
        const original = descriptor.value;
        if (typeof original === 'function') {
            descriptor.value = function (...args) {
                //const span = globalTracer().startSpan(spanName);
                try {
                    const response = original.apply(this, args);
                    console.log(spanName + ' Remote request ok');
                    //span.logEvent('remote request ok', {});
                    return response;
                } catch (e) {
                    //span.setTag('error', 'true');
                    //span.logEvent('remote request failed', {error: e});
                    console.log(spanName + ' Error');
                    throw e;
                } finally {
                    console.log(spanName + ' Finish span');
                    //span.finish();
                }
            }
        }
        return descriptor;
    }
}

class Example {
    @traceRemoteRequest("remote_call_api")
    sum(a, b) {
        return a + b;
    }
}

const e = new Example();
e.sum(1, 2);
