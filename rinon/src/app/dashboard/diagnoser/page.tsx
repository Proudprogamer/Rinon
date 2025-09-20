import ProtectedRoute from "@/app/protected/ProtectedRoute";


function Diagnoser(){
    return (
        <ProtectedRoute allowedRoles="Diagnoser">
            <div>
                This is the diagnoser dashboard;
            </div>
        </ProtectedRoute>
    )
}

export default Diagnoser;