# -*- coding: utf-8 -*-
#!/usr/local/bin/python3

import urllib.request
import urllib.parse
import json


stf_url = "http://172.30.66.59:7100/api/v1/"


def main():
    api = "user"
    cmd = stf_url + api
    token = '55e213835dba4c67871bb15a3cceeb9d9f1edf0043b74038a911ffeb4f0fb5f8'
    request = urllib.request.Request(cmd)
    request.add_header('Authorization', 'Bearer ' + token)
    res = urllib.request.urlopen(request)
    data = res.read()
    doc = json.loads(data)
    import pdb
    pdb.set_trace()



if __name__ == "__main__":
    main()
