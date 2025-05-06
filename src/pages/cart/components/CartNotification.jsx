export default function CartNotification({notificationType, notificationMessage}) {
    return (
        <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-right ${notificationType === 'success'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}
        >
            {notificationType === 'success' ? (
                <Check className='h-5 w-5 text-blue-500' />
            ) : (
                <AlertCircle className='h-5 w-5 text-red-500' />
            )}
            <span>{notificationMessage}</span>
        </div>
    )
}