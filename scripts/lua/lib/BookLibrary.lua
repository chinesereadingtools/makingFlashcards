-- This works with a file exported from calibre containing (authors, cover, title) fields

local config = require "Config"

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
  local file = assert(io.open(config.catalogue, "r"))
  for line in file:lines() do
    local author, cover, title = line:match( '^"(.+)","(.+)","(.+)"$')
    if author ~= nil then
      local path = GetFilepath(cover)
      books[path] = {author = author, title = title}
    end
  end
  file:close()
  return books
end

-- Path -> (author title)
local Books = loadLibrary()
function BookLibrary.getBookData(filepath)
  path = GetFilepath(filepath)
  return Books[path]
end



return BookLibrary
