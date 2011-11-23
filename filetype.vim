" add new filetypes
augroup filetypedetect
	autocmd! BufRead,BufNewFile *.ics set filetype=icalendar
	autocmd! BufRead,BufNewFile *.as set filetype=actionscript
	autocmd! BufRead,BufNewFile */nginx/conf/* set filetype=nginx
	autocmd! BufRead,BufNewFile /etc/fonts/**/*.conf set filetype=xml
	autocmd! BufRead,BufNewFile *.json set filetype=javascript
	autocmd! BufRead,BufNewFile *.js set filetype=javascript
	autocmd! BufRead,BufNewFile *.py set filetype=python
	autocmd! BufRead,BufNewFile *.c set filetype=c
	autocmd! BufRead,BufNewFile *.php set filetype=php
	autocmd! BufRead,BufNewFile *.vim vimrc gvimrc set filetype=vim
	autocmd! BufRead,BufNewFile *.css set filetype=css
	autocmd! BufRead,BufNewFile *.vm set filetype=html
	autocmd! BufRead,BufNewFile *.htm set filetype=html
	autocmd! BufRead,BufNewFile *.html set filetype=html
	autocmd! BufRead,BufNewFile *.xml set filetype=xml
	autocmd! BufRead,BufNewFile *.sh set filetype=sh
augroup END

