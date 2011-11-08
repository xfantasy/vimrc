" add new filetypes
augroup filetypedetect
	autocmd! BufRead,BufNewFile *.ics set filetype=icalendar
	autocmd! BufRead,BufNewFile *.vm set filetype=html
	autocmd! BufRead,BufNewFile *.as set filetype=actionscript
	autocmd! BufRead,BufNewFile */nginx/conf/* set filetype=nginx
	autocmd! BufRead,BufNewFile /etc/fonts/**/*.conf set filetype=xml
	autocmd! BufRead,BufNewFile *.json setfiletype json
augroup END

