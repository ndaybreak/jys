import intl from 'react-intl-universal'

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

var _c = {};
_c.trim = function (val) {
    return val.replace(/(^\s*)|(\s*$)/g, "");
};
_c.notNull = function (val) {
    var reg = /.+/g;
    return this.trim(val).match(reg) ? true : false;
};
_c.isSelect = function (val) {
    var reg = /.+/g;
    return this.trim(val).match(reg) ? true : false;
};
_c.min2 = function (val) {
    var reg = /^.{2,}$/g;
    return this.trim(val).match(reg) ? true : false;
};

_c.onlyNumber = function (val) {
    return !isNaN(val);
};

// 手机号
var MOBILE_REGEXP = /^1[3|4|5|6|7|8|9]\d{9}$/;
_c.mobile = function (val) {
    return MOBILE_REGEXP.test(val)
}

// 邮箱
_c.email = function(val) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(val)
}

// 密码
_c.password = function(val) {
    // var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/;//8~12位密码，必须包含大写字母和数字
    var pwdReg = /^(?![0-9a-z#@*&!]+$)(?![a-zA-Z]+$)[0-9A-Za-z#@*&!]{8,12}$/;//8~12位密码，必须包含大写字母和数字,且允许输入特殊字符
    return pwdReg.test(val)
}

var PHONE_REGEXP = /^0\d{9,11}$/
var PART_PHONE_REGEXP = /^\d{7,8}$/
_c.isMobileOrPhone = function(val) {
    return PART_PHONE_REGEXP.test(val) || PHONE_REGEXP.test(val) || MOBILE_REGEXP.test(val)
}

// 不全是标点符号
_c.notAllPunctuation = function (val) {
    val = this.trim(val)
    if (!val.length) {
        return true
    }
    // 中文标点符号： \u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5
    var REGEXP = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g
    val = val.replace(REGEXP, '')
    return !!val.length
}

// 身份证校验
_c.isIdCardNo = function(num) {
    num = num.toUpperCase();           //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false;
    }
    //验证前2位，城市符合
    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    if(aCity[parseInt(num.substr(0,2))]==null){
        return false;
    }

    //下面分别分析出生日期和校验位
    var len, re; len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);  //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay; bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) { // 身份证号的出生日期不对
            return false;
        } else { //将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for(i = 0; i < 17; i ++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);  //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay; bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) { // 身份证号的出生日期不对
            return false;
        }
        else { //检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for(i = 0; i < 17; i ++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) { // 18位身份证号的校验码不正确
                return false;
            }
            return true;
        }
    }
    return false;
}

// 返回一个数组（只包含两个元素），第一个表示是否校验通过，第二个参数表示校验不通过的类型。
/**
 * validate password
 * @param option {name, value, validates}
 * @returns {Object}
 */
export function validate(option) {
    let { value, validates } = option
    value = (value || '').toString()
    let result = {
        pass: true
    }
    let validate
    let isValid
    for (let i = 0, len = validates.length; i < len; i++) {
        validate = validates[i]
        isValid = _c[validate](value)
        if (!isValid) {
            let msg = validate === 'notNull' ? (intl.get(validate + 'ErrorMsg') + (option.name || '')) : intl.get(validate + 'ErrorMsg')
            result = {
                pass: false,
                failValidate: validate,
                msg: msg
            }
            break;
        }
    }
    return result
}