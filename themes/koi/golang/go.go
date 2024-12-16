package golang

import (
	"github.com/kryshhzz/koi/themes"
)

var KEYWORDS = []themes.KEYWORD{

	{`import`,KEYWORD_COLOR,true,"span"},
	{`package`,KEYWORD_COLOR,true,"span"},
	{`func`,KEYWORD_COLOR,true,"span"},
	{`return`,KEYWORD_COLOR,true,"span"},
	{`go`,KEYWORD_COLOR,true,"span"},

	{`if`,KEYWORD_COLOR_2,true,"span"},
	{`else`,KEYWORD_COLOR_2,true,"span"},
	{`var`,KEYWORD_COLOR_2,true,"span"},
	{`const`,KEYWORD_COLOR_2,true,"span"},

	{`int`,KEYWORD_COLOR_2,true,"span"},
	{`int16`,KEYWORD_COLOR_2,true,"span"},
	{`int32`,KEYWORD_COLOR_2,true,"span"},
	{`int64`,KEYWORD_COLOR_2,true,"span"},
	{`float32`,KEYWORD_COLOR_2,true,"span"},
	{`float64`,KEYWORD_COLOR_2,true,"span"},
	{`string`,KEYWORD_COLOR,true,"span"},
	{`bool`,KEYWORD_COLOR_2,true,"span"},
	{`chan`,KEYWORD_COLOR_2,true,"span"},
	{`type`,KEYWORD_COLOR_2,true,"span"},
	{`struct`,KEYWORD_COLOR_2,true,"span"},
	{`interface`,KEYWORD_COLOR_2,true,"span"},
	{`true`,KEYWORD_COLOR_2,true,"span"},
	{`false`,KEYWORD_COLOR_2,true,"span"},
	{`nil`,KEYWORD_COLOR_2,true,"span"},
	{`for`,KEYWORD_COLOR_2,true,"span"},
	{`range`,KEYWORD_COLOR_2,true,"span"},
	{`break`,KEYWORD_COLOR_2,true,"span"},
	{`continue`,KEYWORD_COLOR_2,true,"span"},
	
	{`\w+(?=\.)`,KEYWORD_COLOR_2,false,"span"}, // any.
	{`\.\w+(?!\()\b`,KEYWORD_COLOR_2,false,"span"}, // .any but not func

	{`(?<=\S|\s)\w+(?=\()`,FUNC_COLOR,false,"span"}, // function

	{`:=`, ACCENT_COLOR,false,"span"},
	{`==`, ACCENT_COLOR,false,"span"},
	{`;`, ACCENT_COLOR,false,"span"},
	{`\(`, ACCENT_COLOR,false,"span"},
	{`\)`, ACCENT_COLOR,false,"span"},
	{`{`, ACCENT_COLOR,false,"span"},
	{`}`, ACCENT_COLOR,false,"span"},
	{`\[`, ACCENT_COLOR,false,"span"},
	{`\]`, ACCENT_COLOR,false,"span"},
	{`\,`,ACCENT_COLOR,false,"span"},
	{`\+`,ACCENT_COLOR,false,"span"},  
	{`\-`,ACCENT_COLOR,false,"span"},  
	{`\*`,ACCENT_COLOR,false,"span"}, 
	{`&#61`,ACCENT_COLOR,false,"span"},  
	{`&gt`,ACCENT_COLOR,false,"span"},  
	{`&lt`,ACCENT_COLOR,false,"span"},  

	{`&quot(.*?)&quot`, STRING_COLOR,false,"span"}, // strings
	{`&#39(.*?)&#39`, STRING_COLOR,false,"span"}, // strings

	{`\\\*(.*?)\*\\`, COMMENT_COLOR,false,"span"}, // one line comments
	{`\/\/[^\n]*`,COMMENT_COLOR,false,"span"}, // multi lined comments
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