DB_CONFIG = {
    'host': 'localhost',
    'port': 27019,
    'user': '',
    'password': '',
    'database': 'DiskImage'
}
DATE_FORMAT = '%d/%m/%Y %H:%M:%S'

# Timeouts in seconds
GET_TIMEOUT = 5
LONG_TIMEOUT = 10

# Intervals in seconds
DISK_REFRESH_INTERVAL = 5
MOUNT_REFRESH_INTERVAL = 5
JOB_REFRESH_INTERVAL = 2.5

# Node API Resources
JOB_RESOURCE = '/api/job'
MOUNT_RESOURCE = '/api/mount'
DISK_RESOURCE = '/api/disk'