let dotnet = null;
try {
    dotnet = require('node-api-dotnet/net9.0');
} catch (err) {
    console.error('Failed to load node-api-dotnet:', err);
    // Allows server to start even if .NET is not installed
}

class InteropApi {
    constructor() {
        // Cache for .NET objects, might be problematic if we require a new instance every time
        this.createdObjects = {};
    }

    getDotNetObject(className) {
        if (!dotnet) {
            throw new Error('node-api-dotnet module not available');
        }
        if (!this.createdObjects[className]) {
            console.log(`Creating new instance of ${className}`);
            this.createdObjects[className] = new dotnet.VRCX[className]();
        }
        return this.createdObjects[className];
    }

    callMethod(className, methodName, args) {
        try {
            const obj = this.getDotNetObject(className);
            if (typeof obj[methodName] !== 'function') {
                throw new Error(
                    `Method ${methodName} does not exist on class ${className}`
                );
            }
            return obj[methodName](...args);
        } catch (e) {
            console.error(
                'Error calling .NET method',
                `${className}.${methodName}`,
                e
            );
            throw e;
        }
    }
}

module.exports = InteropApi;
