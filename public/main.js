const data = (new function () {
    let inc = 0;
    const arr = {};
    //C
    this.create = obj => {
        obj.Id = inc++;
        arr[obj.Id] = obj;
        return obj;
    }
    //R
    this.getAll = () => {
        return Object.values(arr);
    }
    this.get = id => arr[id];
    //U
    this.update = obj => {
        arr[obj.Id] = obj;
        return obj;
    }
    //D
    this.delete = id => {
        delete arr[id];
    }
});
for (let num = 0; num < 10; num++) {
    data.create({
        name: "Студент " + num
        , group: "ЭПИ14"
        , phone: "93024542" + num
        , email: "vasya" + num + "@mail.biz"
    });
}
const util = new function () {
    this.ajax = (params,callback)=>{
        fetch(params).then(data=>data.toJson()).then(callback);
    }
    this.parse = (tpl, obj) => {
        let str = tpl;
        for (let k in obj) {
            str = str.replaceAll("{" + k + "}", obj[k]);
        }
        return str;
    };
    this.id = el => document.getElementById(el);
    this.q = el => document.querySelectorAll(el);
    this.listen = (el, type, callback) => el.addEventListener(type, callback);
}

const student = new function () {
    this.submit = () => {
        const st = {
            name: util.id("name").value,
            group: util.id("group").value,
            phone: util.id("phone").value,
            email: util.id("email").value,
        };
        if(util.id("Id").value === "-1") data.create(st)
        else {
            st.Id = util.id("Id").value;
            data.update(st);
        }
        this.render();
        util.id("edit").style.display = "none";
    }
    this.remove = () => {
        data.delete(activeStudent);
        activeStudent = null;
        this.render();
        util.id("remove").style.display = "none";
    }
    const init = ()=>{
        this.render();
        util.q("button.add").forEach(el=>{
            util.listen(el,"click",add);
        });
        util.q(".btn-close, .close").forEach(el=>{
            util.listen(el,"click",()=>{
                util.id(el.dataset["id"]).style.display = "none";
            });
        });
        util.q(".submit").forEach(el=>{
            util.listen(el,"click",()=>{
                this[el.dataset["func"]]();
            });
        });
    };
    const add = () => {
        util.q("#edit .modal-title")[0].innerHTML = "Добавить студента";
        util.q("#edit form")[0].reset();
        util.id("Id").value = "-1";
        util.id("edit").style.display = "block";
    };
    const edit = el => {
        util.q("#edit .modal-title")[0].innerHTML = "Изменить студента";
        util.q("#edit form")[0].reset();
        /*
        Получаем объект
        * */
        const st = data.get(el.dataset["id"]);
        for(let k in st){
            util.id(k).value = st[k];
        }
        util.id("edit").style.display = "block";
    };
    let activeStudent = null;
    const rm = el => {
        util.id("remove").style.display = "block";
        activeStudent = el.dataset["id"];
    };
    const listeners = {edit: [], rm: []};
    const clearListener = ()=>{
        listeners.edit.forEach(el=>{
            el.removeEventListener("click",edit);
        });
        listeners.rm.forEach(el=>{
            el.removeEventListener("click",rm);
        });
        listeners.edit = [];
        listeners.rm = [];
    };
    const addListener = ()=>{
        util.q("button.edit").forEach(el=>{
            listeners.edit.push(el);
            util.listen(el,"click",()=>edit(el));
        });
        util.q("button.rm").forEach(el=>{
            listeners.rm.push(el);
            util.listen(el,"click",()=>rm(el));
        });
    };
    this.render = () => {
        clearListener();
        util.id("table").innerHTML = data
            .getAll()
            .map(el => util.parse(tpl, el)).join("");
        addListener();
    };

    const tpl = `
        <tr>
        <td>{Id}</td>
        <td>{name}</td>
        <td>{group}</td>
        <td>{phone}</td>
        <td>{email}</td>
        <td>
            <button class="btn btn-primary edit" data-id="{Id}" type="button">Изменить</button>
            <button class="btn btn-danger rm" data-id="{Id}" type="button">Удалить</button>
        </td>
        </tr>
    `;
    window.addEventListener("load",init);
};