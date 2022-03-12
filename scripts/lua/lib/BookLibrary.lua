-- This works with a file exported from calibre containing (authors, cover, title) fields

local config = require "Config"
local JSON = require "JSON"

local BookLibrary = {}

--This function finds the filename when given a complete path
function GetFilename(fullpath)
    path, file = fullpath:match("^(.+)/([^/]+)$")
    return file
end

function GetFilepath(fullpath)
    path, file = fullpath:match("^(.+)/([^/]+)$")
    return path
end

function loadLibrary()
    local books = {}
    local cmd =
        "calibredb --library-path '" .. config.library ..
        "' list -f cover,authors,title --for-machine --sort-by authors"
    local handle = io.popen(cmd)
    local result = handle:read("*a")
    handle:close()
    booksJson = JSON:decode(result)
    for a, b in pairs(booksJson) do
      local author = b.authors
      local path = GetFilepath(b.cover)
      local title = b.title
      books[path] = {author = author, title = title}
    end
    return books
end

-- Path -> (author title)
local Books = loadLibrary()
function BookLibrary.getBookData(filepath)
    path = GetFilepath(filepath)
    return Books[path]
end


return BookLibrary
