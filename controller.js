$(document).ready(function(){
    let arrayObj = [
    ]
    let isAllChecked = false;
    const selectedRows = [];
    let currentPage = 1;
    let pageLimit = 3;
    // Select/Deselect checkboxes
    $('#selectAll').click(function (e) {
        console.log('hasdhfa')
        if(this.checked) {
            isAllChecked = true;
            selectedRows.length = 0;
            arrayObj.forEach((user)=>{
                selectedRows.push(user.id)
            })
        }else{
            isAllChecked = false;
            selectedRows.length = 0; //check
        }
        $(this).closest('table').find('td input:checkbox').prop('checked', this.checked);
    });


    function registerChangeEvent(){
        $('input[type=checkbox][name=row]').change(function() {
            console.log(selectedRows)
            const index = arrayObj.findIndex(user => user.id === +this.value);
            arrayObj[index].checked = $(this).prop("checked");
            if ($(this).prop("checked")) {
                selectedRows.push(+this.value)
                console.log(`${this.value} is checked`,selectedRows);
                if(selectedRows.length == 1) $("#editBtn").prop("disabled", false);
                if(selectedRows.length == arrayObj.length) $('#selectAll')[0].checked = true;
            }
            else {
                const index = selectedRows.indexOf(+this.value)
                selectedRows.splice(index,1)
                if(selectedRows.length == 1) $("#editBtn").prop("disabled", false);
                $('#selectAll')[0].checked = false;
                console.log(`${this.value} is unchecked`,selectedRows);
            }
        });
        $(".pagination").children().remove();
        for(let i=1;i<=Math.ceil(arrayObj.length / pageLimit);i++){
            $(".pagination").append(`
                <li class="page-item"><a class="page-link" id="page-${i}">${i}</a></li>
            `)
        }
        $(".pagination").append(`
            <li class="page-item"><a class="page-link" id="Next">Next</a></li>
            <li class="page-item" ><a class="page-link" id="Last">Last</a></li>
        `)
        $(".page-link").click(function(e){
            console.log('currentPage',e.target.id)
            if(e.target.id === 'Next' && currentPage === Math.ceil(arrayObj.length / pageLimit)) return;
            else if(e.target.id === 'Next') currentPage += 1;
            else if(e.target.id === 'Last') currentPage = Math.ceil(arrayObj.length / pageLimit);
            else{
                currentPage = +e.target.id.split("-")[1];
                // console.log('page',currentPage)
            };
            loadData();
        })
    }


    function loadData(){
        isAllChecked = false;
        selectedRows.length = 0;
        $("#editBtn").prop("disabled", true);
        $("#tbody").children().remove();
        $('#selectAll')[0].checked = false;
        console.log(currentPage,pageLimit)
        for(let i=(currentPage-1)*pageLimit; i<((currentPage-1)*pageLimit)+pageLimit; i++){
            const userInfo = arrayObj[i];
            console.log(userInfo)
            if(!arrayObj[i]) break;
            $('#tbody').append(`
                <tr>
                    <td>
                        <span class="custom-checkbox">
                            <input type="checkbox" id="${userInfo.id}" name="row" value="${userInfo.id}">
                            <label for="${userInfo.id}"></label>
                        </span>
                    </td>
                    <td>${userInfo.id}</td>
                    <td>${userInfo.name}</td>
                    <td>${userInfo.email}</td>
                </tr>`
            );
        }
        registerChangeEvent();
    }
    $('#loadDataBtn').on('click', function (e) {
        e.preventDefault()
        fetch('http://localhost:3232/users/getUsers')
            .then((response) => response.json())
            .then((json) => {
                console.log('from api',json)
                if(json.Error) return alert(`Error from api: ${json.Error}`)
                arrayObj = json.users;
                loadData()
            })
            .catch((err)=>{alert('Error from api:',JSON.stringify(err))})
    });

    $('#addBtn').on('click', function (e) {
        e.preventDefault() 
        let length = arrayObj.length;
        var name = $("#name").val();
        var email = $("#email").val();
        // arrayObj.push({
        //     id:length,
        //     name,
        //     email
        // });
        console.log(arrayObj)
        fetch('http://localhost:3232/users/createUser',{
            method: 'POST',
            body:JSON.stringify({name,email}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
            })
            .then((response) => response.json())
            .then((json) => {
                console.log('from api',json)
                if(json.Error) return console.log(`Error from api: ${json.Error}`)
                arrayObj = json.users;
                loadData()
                $("#name").val("");
                $("#email").val("");
                $("#addEmployeeModal").modal('hide');
            })
            .catch((err)=>{alert('Error from api:',JSON.stringify(err))})
        // loadData();
        // $("#name").val("");
        // $("#email").val("");
        $("#addEmployeeModal").modal('hide');
    });
    let editedUserIndex = null;
    $("#editBtn").prop("disabled", true);

    $('#editBtn').on('click', function () { 
        if(selectedRows.length > 1) $("#editBtn").prop("disabled", true);
        const firstSelectedId = selectedRows[0];
        const index = arrayObj.findIndex(user => user.id === +firstSelectedId);
        const firstSelectedUser = arrayObj[index];
        editedUserIndex = index;
        $("#editedName").val(firstSelectedUser.name);
        $("#editedEmail").val(firstSelectedUser.email);
    });
    
    $('#saveBtn').on('click', function (e) {
        e.preventDefault()
        let length = arrayObj.length;
        var name = $("#editedName").val();
        var email = $("#editedEmail").val();
        const editedUser = arrayObj[editedUserIndex];
        console.log(editedUserIndex,editedUser)
        // editedUser.name = name;
        // editedUser.email = email;
        fetch(`http://localhost:3232/users/updateUser/${editedUserIndex}`,{
            method: 'PUT',
            body:JSON.stringify({name,email}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
            })
            .then((response) => response.json())
            .then((json) => {
                console.log('from api',json)
                if(json.Error) return alert(`Error from api: ${json.Error}`)
                arrayObj = json.users;
                loadData();
                $("#editedName").val("");
                $("#editedEmail").val("");
                $("#editEmployeeModal").modal('hide');
                editedUserIndex = null;
            })
            .catch((err)=>{alert('Error from api:',JSON.stringify(err))})
        // loadData();
        // $("#editedName").val("");
        // $("#editedEmail").val("");
        // $("#editEmployeeModal").modal('hide');
        // editedUserIndex = null;
    });
    // Find and remove selected table rows
    $("#deleteRows").click(function(){
        console.log('clickhed',selectedRows)
        const body = {};
        if(isAllChecked || selectedRows.length === arrayObj.length){
            // arrayObj.length = 0;
            // selectedRows.length = 0; //check
            body.deleteAll = true;
        }
        else {
            body.selectedRows = selectedRows;
            console.log(selectedRows)
            /*
            selectedRows.forEach((selectedUserId)=>{
                const index = arrayObj.findIndex(user => user.id === +selectedUserId);
                if(index > -1) arrayObj.splice(index,1)
            })
            */
        }

        if(Object.keys(body).length === 0) return;

        fetch('http://localhost:3232/users/deleteManyUsers',{
            method: 'POST',
            body:JSON.stringify(body),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
            })
            .then((response) => response.json())
            .then((json) => {
                console.log('from api',json)
                if(json.Error) return console.log(`Error from api: ${json.Error}`)
                arrayObj = json.users;
                if(body.deleteAll) selectedRows.length = 0;
                loadData()
            })
            .catch((err)=>{alert('Error from api:',JSON.stringify(err))})

        // loadData();
    });

	// Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();
	
});