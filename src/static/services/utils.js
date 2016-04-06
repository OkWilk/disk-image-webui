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

    this.getSubjectivePercentage = function(size, total) {
        var percentage = Math.floor((size / total) * 100);
        if(percentage < 1) {
            return 1 + "%";
        } else if (percentage > 25) {
            return (percentage - 1) + "%";
        } else {
            return percentage + "%";
        }
    };

    return this;
});

AppModule.service('PartitionInfo', ['SizeParser', function(SizeParser) {

    this.getInfo = function(partition) {
        var info = "<p><b>File-system:</b> ";
        if (partition.fs != "") {
            info += partition.fs
        } else {
            info += "raw"
        }
        info += "<br/><b>Size: </b>" + SizeParser.parse(partition.size) + "</p>";
        return info
    };

    return this;
}]);

AppModule.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});