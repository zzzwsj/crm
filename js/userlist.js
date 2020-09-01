$(function () {
    let checkList = null;

    // 实现显示部门
    initDepartMent();
    async function initDepartMent() {
        let result = await queryDepart();
        if (result.code == 0) {
            let str = ``;
            result.data.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`
            })
            $(".selectBox").html(str);
        }
    }

    // 展示员工列表
    showUserList();
    async function showUserList() {
        // 封装两个条件参数
        let params = {
            departmentId: $(".selectBox").val(),
            search: $(".searchInp").val().trim(),
        }
        let result = await axios.get("/user/list", { params });
        // console.log(result);
        if (result.code !== 0) return;

        let str = ``;
        result.data.forEach(item => {
            let {
                id,
                name,
                sex,
                email,
                phone,
                department,
                job,
                desc
            } = item;
            str += `<tr>
            <td class="w3"><input type="checkbox" userId="${id}"></td>
            <td class="w10">${name}</td>
            <td class="w5">${sex == 0 ? '男' : '女'}</td>
            <td class="w10">${department}</td>
            <td class="w10">${job}</td>
            <td class="w15">${email}</td>
            <td class="w15">${phone}</td>
            <td class="w20">${desc}</td>
            <td class="w12" userId="${id}">
                <a href="javascript:;">编辑</a>
                <a href="javascript:;">删除</a>
                <a href="javascript:;">重置密码</a>
            </td>
        </tr>`
        })
        $("tbody").html(str);

        checkList = $("tbody").find('input[type="checkbox"]');
    }

    // 根据条件显示员工列表
    searchHandle();
    function searchHandle(){
        $(".selectBox").change(showUserList);
        $(".searchInp").on("keydown", e=>{
            if(e.keyCode === 13){  // 回车
                showUserList();
            }
        })
    }

    // 基于事件委托使用编辑、删除和修改密码 
    delegate();
    function delegate(){
        $("tbody").on("click","a",async e=>{
            // console.log(e);
            let target = e.target,
                tag = target.tagName,
                text = target.innerHTML.trim();
            if(tag === "A"){
                let userId = $(target).parent().attr("userid");
                // 代表你点击了编辑或删除或修改密码按钮
                if(text === "编辑"){
                    // console.log("实现编辑的功能");
                    // 跳转到添加用户页面(编辑，传递一个id过去)
                    window.location.href = `useradd.html?id=${userId}`;
                    return;
                }
                if(text === "删除"){
                    // console.log("实现删除的功能");
                    let flag = confirm("你确定要删除此用户吗？");
                    if(!flag) return;
                    let result = await axios.get("/user/delete",{
                        params:{ userId }
                    })
                    if(result.code === 0){
                        alert("删除用户信息成功！");
                        // 调用接口删除数据，删掉的是数据库中的数据，还需要把页面中的数据信息删除
                        $(target).parent().parent().remove();
                        checkList = $("tbody").find('input[type="checkbox"]');
                        return;
                    }
                    return;
                }
                if(text === "重置密码"){
                    // console.log("实现重置密码的功能");
                    let flag = confirm("你确定要重置此用户的密码吗？");
                    if(!flag) return;
                    let result = await axios.post("/user/resetpassword",{
                        userId
                    })
                    if(result.code === 0){
                        alert("重置密码成功，告诉你的员工~");
                        return;
                    }
                    return;
                }
            }
        })
    }

    // 全选处理
    selectHandle();
    function selectHandle(){
        $("#checkAll").click(e=>{
            let checked = $("#checkAll").prop("checked");
            checkList.prop("checked",checked);
        })

        $("tbody").on("click","input",e=>{
            if(e.target.tagName === "INPUT"){
                let flag = true;
                newCheckList = Array.from(checkList);
                newCheckList.forEach(item=>{
                    if(!$(item).prop("checked")){
                        // 有小框框没有勾选
                        flag = false;
                    }
                })
                $("#checkAll").prop("checked",flag);
            }
        })
    }

    // 实现批量删除操作
    $(".deleteAll").click(e=>{
        // 找到你勾选的用户，把此用户的userId放到一个数组中
        let arr = [];
        [].forEach.call(checkList,item=>{
            if($(item).prop("checked")){
                console.log($(item));
                // 选中
                arr.push($(item).attr('userid'));
            }
        })
        // console.log(arr);

        if(arr.length === 0){
            alert("你需要先选中一些用户~");
            return;
        }
        let flag = confirm("你确定要删除这些用户吗？");
        if(!flag) return;

        let index = -1;
        async function deleteUser(){
            let userId = arr[++index];
            // 递归出口
            if(index>=arr.length){
                alert("已成功删除员工~");
                showUserList();
                return;
            }

            let result = await axios.get("/user/delete",{
                params:{
                    userId
                }
            })
            if(result.code != 0){
                // 删除失败啦
                return;
            }
            deleteUser();
        }
        deleteUser();
    })




})