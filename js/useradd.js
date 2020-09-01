$(function () {

    // 根据userid区分是新增还是编辑
    let userId = null;
    // console.dir(window.location.href);
    let params = window.location.href.queryURLParams();
    // console.log(params);
    if(params.hasOwnProperty("id")){
        userId = params.id;
        // 根据ID获取用户的信息，实现数据的回显
        getBaseInfo();
    }
    async function getBaseInfo(){
        let result = await axios.get("/user/info",{
            params:{ userId }
        })
        if(result.code === 0){
            // 给表单中的数据，实现数据的回显
            result = result.data;
            $(".username").val(result.name);
            result.sex == 0 ? $("#man").prop('checked',true) : $("#woman").prop('checked',true);
            $(".useremail").val(result.email);
            $(".userphone").val(result.phone);
            $(".userdepartment").val(result.departmentId);
            $(".userjob").val(result.jobId);
            $(".userdesc").val(result.desc);
            return;
        }
        alert("编辑不成功，请稍后再试....");
        userId = null;
    }

    // 初始化部门和职务的数据
    initDeptAndJob();
    async function initDeptAndJob() {
        let departmentData = await queryDepart();
        let jobData = await queryJob();
        // console.log(departmentData);
        // console.log(jobData);

        if (departmentData.code === 0) {
            departmentData = departmentData.data;
            let str = ``;
            departmentData.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`
            });
            $(".userdepartment").html(str);
        }
        if (jobData.code === 0) {
            jobData = jobData.data;
            let str = ``;
            jobData.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`
            })
            $(".userjob").html(str);
        }
    }

    // 校验函数
    function checkname() {
        let val = $(".username").val().trim();
        if (val.length === 0) {
            $(".spanusername").html("此为必填项~");
            return false;
        }
        // 用户名必须填写真实姓名（2-10个字）
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
            $(".spanusername").html("用户名必须是2-10个汉字!");
            return false;
        }
        $(".spanuesername").html("用户名可以使用！");
        return true;
    }
    function checkemail() {
        let val = $(".useremail").val().trim();
        if (val.length === 0) {
            $(".spanuseremail").html("此为必填项~");
            return false;
        }
        if (!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)) {
            $(".spanuseremail").html("请填写正确的邮箱！");
            return false;
        }
        $(".spanuesername").html("");
        return true;
    }
    function checkphone() {
        let val = $(".userphone").val().trim();
        if (val.length === 0) {
            $(".spanuserphone").html("此为必填项~");
            return false;
        }
        if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(val)) {
            $(".spanuserphone").html("请填写正确的手机号~");
            return false;
        }
        $(".spanuserphone").html("");
        return true;
    }

    // 失去焦点时，对数据进行校验
    // 校验用户名
    $(".username").blur(checkname);
    // 校验youxiang
    $(".useremail").blur(checkemail);
    // 校验手机号
    $(".userphone").blur(checkphone);

    $(".submit").click(async function () {
        if (!checkname() || !checkemail() || !checkphone()) {
            alert("你填写的数据不合法");
            return;
        }

        // 校验通过
        // 获取用户输入的数据
        let params = {
            name: $(".username").val().trim(),
            sex: $("#man").prop("checked") ? 0 : 1,
            email: $(".useremail").val().trim(),
            phone: $(".userphone").val().trim(),
            departmentId: $(".userdepartment").val().trim(),
            jobId: $(".userjob").val(),
            desc: $(".userdesc").val().trim()
        }
        // console.log(params);

        // 判断是编辑还是新增
        if(userId){
            params.userId = userId;
            // 新增
            let result = await axios.post("/user/update",params);
            if(result.code === 0){
                alert("修改数据成功");
                window.location.href = "userlist.html";
                return;
            }
            alert("修改失败，请稍后再试~");
            return;
        }

        // 实现新增
        let result = await axios.post("/user/add",params);
        if(result.code === 0){
            alert("添加员工成功~");
            window.location.href = "userlist.html";
            return;
        }
        alert("网络不给力，请稍后再试~");
    })


})





