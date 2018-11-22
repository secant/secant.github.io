---
layout: post
title:  "Live word count in vim airline"
category: tech
comments: true
---

This was a result of using vim to write my essays. I started writing them in
notes ([vim-notes](https://github.com/xolox/vim-notes) plugin) files and wanted
[vim-airline](https://github.com/vim-airline/vim-airline) to display a live word
count.

# The Easy Way
As of [this version](https://github.com/chrisbra/vim-airline/blob/0d128940ad3cd9fa14b48c93d98eb321bb5f6b1a/autoload/airline/extensions/wordcount.vim) of vim-airline's wordcount plugin.

In your `vimrc`, add:

```vim
" Enable wordcount
let g:airline#extensions#wordcount#enabled = 1
" Add notes to filetypes
let g:airline#extensions#wordcount#filetypes = '\vnotes|help|markdown|rst|org|text|asciidoc|tex|mail'
```

By default, files of the type `help|markdown|rst|org|text|asciidoc|tex|mail` run
the wordcount plugin.

# The Complicated Way
_Note: When I came up with this, I was really frustrated because I could not
figure out `The Easy Way' -- the wordcount plugin went through a few re-writes
that left the documented format of expressing filetypes outdated. So I decided
to figure out how to write it by myself. Of course, I would figure out the easy
way after I finished documenting the complicated way. Go Vivian._

<div align="center" markdown="1">
![normal mode word
count](/assets/blog/2018-10-15/normal-mode.png){:width="300px"}
![visual mode word count](/assets/blog/2018-10-15/visual-mode.png){:width="300px"}
</div>

You can get word count by typing <kbd>g</kbd> <kbd>Ctrl</kbd>+<kbd>g</kbd> in
normal mode, or in visual mode (which will tell you how many words are
selected).

First, I define a function that grabs the word count using the above command.
First, it saves the position of the cursor. Then, it parses `v:statusmsg` by
looking at whether you're in Visual mode or not.

```vim
function! WordCount()
    let position = getpos(".")
    exe ":silent normal g\<c-g>"
    let stat = v:statusmsg
    let s:word_count = 0
    if stat != '--No lines in buffer--'
        if mode() == "V"
            let s:word_count = str2nr(split(stat)[5])
        else
            let s:word_count = str2nr(split(stat)[11])
        endif
    endif
    call setpos('.', position)
    return s:word_count
endfunction
```

This is how I made it show up in airline for files of the type `note`.
Note that vim-airline automatically handles this for some set of default
filetypes (see [The Easy Way](#the-easy-way)).

```vim
function! AirlineWC(...)
    if &filetype == 'notes'
        let w:airline_section_b = '%{WordCount()} words'
    endif
endfunction
call airline#add_statusline_func('AirlineWC')
```

