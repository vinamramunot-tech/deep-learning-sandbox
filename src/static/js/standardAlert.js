function standardAlert() {
    function inform(message) {
        toastme.yesNoDialog({
            title: "Info",
            text: message,
            textConfirm: "Ok",
            textCancel: "",
            showCancel: false,
            type: 'info',
            dark: false
        });
    }

    function warn(message) {
        toastme.yesNoDialog({
            title: "Warning",
            text: message,
            textConfirm: "Ok",
            textCancel: "",
            showCancel: false,
            type: 'warning',
            dark: false
        });
    }

    function error(message) {
        toastme.yesNoDialog({
            title: "Error",
            text: "There was an unexpected error. Try refreshing the page to remove the error.",
            textConfirm: "Ok",
            textCancel: "",
            showCancel: false,
            type: 'danger',
            dark: false
        });
    }

    function customAction({title, message, type, okButtonName, cancelButtonName, okAction = ()=>{}, cancelAction = ()=>{}}) {
        toastme.yesNoDialog({
            title: title,
            text: message,
            textConfirm: okButtonName,
            textCancel: cancelButtonName || "",
            showCancel: !!cancelButtonName,
            type: type,
            dark: false
        }).then(value => {
            if (value) 
                okAction();
            else
                cancelAction();
        });
    }

    function destructiveAction(buttonName, action) {
        toastme.yesNoDialog({
            title: "Are you sure you want to perform this action?",
            text: "This action cannot be undone!",
            textConfirm: buttonName,
            textCancel: "Cancel",
            showCancel: true,
            type: 'danger',
            dark: false
        }).then(value => {
            if (value) action();
        });
    }

    return {inform, warn, error, customAction, destructiveAction};
}