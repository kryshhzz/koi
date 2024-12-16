package html

import (
	"github.com/kryshhzz/koi/themes"
)

var KEYWORDS = []themes.KEYWORD{
 
	{`&#61`,ACCENT_COLOR,false,"span"},  
	{`&gt`,ACCENT_COLOR,false,"span"}, 
	{`&lt`,ACCENT_COLOR,false,"span"}, 
}

var KEYWORD_COLOR = "themeKeyword"
var KEYWORD_COLOR_2 = "themeKeywordTwo"
var STRING_COLOR = "themeString";
var COMMENT_COLOR = "themeComment"
var ACCENT_COLOR = "themeAccent"
var FUNC_COLOR = "themeFunc"

func init(){
	//(?<!")\bkrishna\b(?!")(?=\s|$)
	for i,v := range KEYWORDS { 
		if KEYWORDS[i].Change {
			KEYWORDS[i].Regex = `\b`+v.Regex+`\b`
		}
	}
}