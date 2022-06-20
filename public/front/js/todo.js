$(document).ready(function () {
    var conf = {
        tokenCookie: "token",
        refreshTokenCookie: "refreshTocken",
        routes: {
            login: "/api/login_check",
            refreshToken: "/api/token/refresh",
            taskList: "/api/task-lists",
            task: "/api/tasks",
        }
    }
    var tools = {
        mustacheRender: function (templateId, $activeElm, data = null) {
            let template = document.getElementById(templateId).innerHTML;
            let rendered = Mustache.render(template, data);
            document.getElementById($activeElm).innerHTML = rendered;
        },
        serializeForm: function ($form) {
            return _.object(_.map($form.serializeArray(), function (item) {
                return [item.name, item.value];
            }));
        },
        showLoader: function () {
            $('.request-info').html('<div class="spinner-grow" role="status">\n' +
                '                                    <span class="visually-hidden">Loading...</span>\n' +
                '                                </div>');
        },
        showSuccessMessage: function (msg) {
            $('.request-info').html("<div class=\"alert alert-info\" role=\"alert\">\n" +
                msg +
                "</div>\n");
        },
        showRequestErrorMsg: function (error) {
            $('.request-info').html("" +
                "<div class=\"alert alert-danger\" role=\"alert\">\n" +
                error +
                "</div>\n")
        }

    }
    var todo = {
        apiClient: function () {
            return axios.create({
                baseURL: 'http://localhost:8080',
                timeout: 5000,
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get(conf.tokenCookie),
                    'Content-Type': 'application/ld+json'
                },
                transitional: {
                     silentJSONParsing: true,
                     forcedJSONParsing: true,
                     clarifyTimeoutError: false,
                },

            });
        }
    }

    var login = {
        loginformSelector: "#loginForm",
        init: function () {
            if (Cookies.get(conf.tokenCookie) === undefined) {
                tools.mustacheRender('login', 'container');
                this.listenToSubmit();
                return;
            }
            todoList.init();
        },
        listenToSubmit: function () {
            let that = this;
            $(document).on("submit", this.loginformSelector, function (e) {
                tools.showLoader();
                that.handleLogin($(this));

                e.preventDefault();
                return false;
            }).bind(tools).bind(that);
        },
        handleLogin: function ($el) {
            let apiClient = todo.apiClient();

            apiClient
                .post(conf.routes.login, tools.serializeForm($el))
                .then(function (response) {
                    Cookies.set(conf.tokenCookie, response.data['token']);
                    Cookies.set(conf.refreshTokenCookie, response.data['refresh_token']);
                    todoList.init();


                })
                .catch(function (error) {
                    tools.showRequestErrorMsg(error.message);
                });
            ;
        }

    }

    var todoList = {
        addTodoformSelector: "#todoListForm",
        removeButtonSelector: ".removeTodo",
        logoutButtonSelector: "#btn-logout",
        init: function () {
            tools.showLoader();

            this.loadTodoList();
            this.listenToAddTodo();
            this.listenToDeleteTodo();
            this.listenToLogout();

        },
        loadTodoList: function () {
            let apiClient = todo.apiClient();

            apiClient
                .get(conf.routes.taskList)
                .then(function (response) {
                    tools.mustacheRender('todoList', 'container', response.data['hydra:member']);
                    tools.showSuccessMessage('Tasks list Loaded.');

                })
                .catch(function (error) {
                    Cookies.remove(conf.tokenCookie);
                    Cookies.remove(conf.refreshTokenCookie);
                    login.loadTodoList();
                    tools.showRequestErrorMsg(error.message);
                });
            ;
        },
        listenToAddTodo: function () {
            let that = this;
            $(document).on("submit", this.addTodoformSelector, function (e) {
                tools.showLoader();
                that.addTodo($(this));

                e.preventDefault();
                return false;
            }).bind(that).bind(tools);
        },
        addTodo: function ($el) {

            let apiClient = todo.apiClient();
            apiClient
                .post(conf.routes.taskList, tools.serializeForm($el))
                .then(function (response) {
                    todoList.loadTodoList();
                    tools.showSuccessMessage('Task list added.');


                })
                .catch(function (error) {
                    tools.showRequestErrorMsg(error.message);
                });
            ;
        },
        listenToDeleteTodo: function () {
            let that = this;
            $(document).on("click", this.removeButtonSelector, function (e) {
                tools.showLoader();
                that.deleteTodo($(this));

                e.preventDefault();
                return false;
            }).bind(tools).bind(that);
        },
        deleteTodo: function ($el) {
            let apiClient = todo.apiClient();

            apiClient
                .delete($el.data('id'))
                .then(function (response) {
                    tools.showSuccessMessage('Task list deleted.');
                    todoList.loadTodoList();

                })
                .catch(function (error) {
                    tools.showRequestErrorMsg(error.message);
                });
            ;
        },
        listenToLogout: function () {
            let that = this;
            $(document).on("click", this.logoutButtonSelector, function (e) {
                tools.showLoader();
                Cookies.remove(conf.tokenCookie);
                Cookies.remove(conf.refreshTokenCookie);
                login.init();
            }).bind(tools).bind(that);
        },
    }
    login.init();
})