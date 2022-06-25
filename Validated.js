// Object Validator
function Validator(options) {
    function Validate(inputE__value, rule, index) {
        var message = rule.check(inputE__value)
        var spanError = document.querySelectorAll(".error--message")[index];
        if (message) {
            spanError.innerHTML = message
        }
        else{
            spanError.innerHTML =''
        }
        return !message
    }

    var formE = document.querySelector(options.form)
    if (formE) {
        formE.onsubmit = function (e){
            e.preventDefault()
            var isFormValid =true;
            options.rules.forEach(function (rule,index){
                var inputElement = formE.querySelector(rule.selector)
                var isValid = Validate(inputElement.value, rule,index)
                if(!isValid){
                    isFormValid=false;
                }
            })
            if (isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enabledInput =formE.querySelectorAll('[name]')
                    var formValue=Array.from(enabledInput).reduce(function (value,input){
                        return (value[input.name]=input.value) && value;
                    },{})
                    console.log(formValue);
                }
            } else {
                options.onSubmit(['Có Lỗi'])
            }
        }
        options.rules.forEach(function (rule, index) {
            
            var inputE = document.querySelector(rule.selector)
            if (inputE) {
                inputE.onblur = function () {
                    Validate(inputE.value,rule, index)
                }
                inputE.oninput = function () {
                    var spanError = document.querySelectorAll(".error--message")[index];
                    spanError.innerHTML = ''
                }
            }
        })
    }

}

// Define rules
Validator.isRequired = function (selector,message) {
    return {
        selector: selector,
        check: function (value) {
            return value ? undefined :message|| "Vui lòng nhập phần này"
        }
    }
}
Validator.isEmail = function (selector) {
    return {
        selector: selector,
        check: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là Email"
        }
    }
}
Validator.isMinLength = function (selector,length){
    return{
        selector: selector,
        check: function (value) {
            return value.length>=length? undefined : `Mật khẩu phải dài hơn ${length} kí tự`
        }
    }
}
Validator.isTrue=function (selector,getPassWord,message){
    return{
        selector: selector,
        check: function (value){
            return value===getPassWord()? undefined :message ||`Mật khẩu nhập lại chưa đúng`
        }
    }
}

//------------------------------------------------------------------------------
Validator({
    form: '#form-1',
    rules: [
        Validator.isRequired('.form--name','Vui lòng nhập tên đầy đủ của bạn'),
        Validator.isEmail('.form--email'),
        Validator.isMinLength('.form--password',6),
        Validator.isTrue('.form--rePassword',function(){
            return document.querySelector("#form-1 .form--password").value
        },'Mật khẩu nhập lại không chính xác')
    ],
    onSubmit: function(data){
        console.log(data);
    }
})