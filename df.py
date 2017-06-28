import subprocess
import shlex
import json

data_path = "/home/gvadmin/dev/data/"

def main():
    """Main routine - call the df utility and return a json structure."""

    # this next line of code is pretty tense ... let me explain what
    # it does:
    # subprocess.check_output(["df"]) runs the df command and returns
    #     the output as a string
    # rstrip() trims of the last whitespace character, which is a '\n'
    # split('\n') breaks the string at the newline characters ... the
    #     result is an array of strings
    # the list comprehension then applies shlex.split() to each string,
    #     breaking each into tokens
    # when we're done, we have a two-dimensional array with rows of
    # tokens and we're ready to make objects out of them
    df_array = [shlex.split(x) for x in
                subprocess.check_output(["df"]).decode("utf-8").rstrip().split('\n')]
    df_num_lines = df_array[:].__len__()

    df_json = {}
    df_json["filesystems"] = []
    for row in range(1, df_num_lines):
        df_json["filesystems"].append(df_to_json(df_array[row]))
    file_content = json.dumps(df_json, sort_keys=True, indent=2)
    print (file_content)
    with open(data_path+'fs_data.json',"w") as data_file:
        data_file.write(file_content)
    return

def df_to_json(tokenList):
    """Take a list of tokens from df and return a python object."""
    # If df's ouput format changes, we'll be in trouble, of course.
    # the 0 token is the name of the filesystem
    # the 1 token is the size of the filesystem in 1K blocks
    # the 2 token is the amount used of the filesystem
    # the 5 token is the mount point
    result = {}
    fsName = tokenList[0]
    fsSize = tokenList[1]
    fsUsed = tokenList[2]
    fsMountPoint = tokenList[5]
    result["filesystem"] = {}
    result["filesystem"]["name"] = fsName
    result["filesystem"]["size"] = fsSize
    result["filesystem"]["used"] = fsUsed
    result["filesystem"]["mount_point"] = fsMountPoint
    return result

if __name__ == '__main__':
    main()