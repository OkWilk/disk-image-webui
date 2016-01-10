AppModule.service('SizeParser', function() {
    this.parse = function(bytes) {
        var threshold = 1024;
        if(Math.abs(bytes) < threshold) {
            return bytes + ' B';
        }
        var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
        var unitIndex = -1;
        do {
            bytes /= threshold;
            ++unitIndex;
        } while(Math.abs(bytes) >= threshold && unitIndex < units.length - 1);
        return bytes.toFixed(1)+' '+units[unitIndex];
    };
    return this;
});
