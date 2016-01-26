AppModule.service('PartitionInfo', ['SizeParser', function(SizeParser) {

    this.getInfo = function(partition) {
        info = "<p><b>File-system:</b> "
        if (partition.fs != "") {
            info += partition.fs
        } else {
            info += "raw"
        }
        info += "<br/><b>Size: </b>" + SizeParser.parse(partition.size) + "</p>"
        return info
    }

    return this;
}]);
