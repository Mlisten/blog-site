export enum Pattern {
    DEFAULT_DATE_TIME = ("yyyy-MM-dd HH:mm:ss"),
    CHINESE_DATE_TIME = ("yyyy年MM月dd日 HH时mm分ss秒"),
    DEFAULT_DATE = ("yyyy-MM-dd"),
    CHINESE_DATE = ("yyyy年MM月dd日"), //默认规则
    DEFAULT_TIME = ("HH:mm:ss"),
    CHINESE_TIME = ("HH时mm分ss秒"),
}

export default{
    format (time?:number|string|Date, pattern ?: Pattern | 'yyyy-MM-dd HH:mm:ss' | 'yyyy年MM月dd日 HH时mm分ss秒' | 'yyyy-MM-dd' | 'yyyy年MM月dd日' | 'HH:mm:ss' | 'HH时mm分ss秒') : string | null{
        if (!pattern){
            pattern = Pattern.CHINESE_DATE
        }
        let date :Date = new Date();
        if (time){
            date = new Date(time)
        }
        let fullYear = date.getFullYear();
        let month = date.getMonth() + 1 ;
        let day = date.getDate();

        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let formatTime :string = '';

        if (pattern === 'yyyy-MM-dd'){
            formatTime = fullYear+'-'+month+'-'+day;
        }else if (pattern ==='yyyy-MM-dd HH:mm:ss'){
            formatTime = fullYear+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
        }else if (pattern === 'yyyy年MM月dd日'){
            formatTime = fullYear+'年'+month+'月'+day+'日';
        }else if (pattern === 'yyyy年MM月dd日 HH时mm分ss秒'){
            formatTime = fullYear+'年'+month+'月'+day+'日 '+hour+'时'+minute+'分'+second+'秒';
        }else if (pattern === 'HH:mm:ss'){
            formatTime = hour+':'+minute+':'+second
        }else if (pattern ==='HH时mm分ss秒'){
            formatTime = hour+'时'+minute+'分'+second+'秒'
        }else {
            throw new Error('pattern格式设置有误!')
        }
        return formatTime;
    }
}