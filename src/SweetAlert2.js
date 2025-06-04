class SweetAlert2 {
    static async ShowMessage(message, messageTitle, messageIcon) {
        if (messageIcon === 'question') {
            const result = await window.Swal.fire({
                icon: messageIcon,
                title: messageTitle,
                text: message,
                showCancelButton: true,
                confirmButtonText: "Sí",
                cancelButtonText: "No",
            });

            return result.isConfirmed;
        }
        else {
            return window.Swal.fire({
                icon: messageIcon,
                title: messageTitle,
                text: message
            });
        }
    }
}

export default SweetAlert2;