import Pet from "../components/Pet";

export default function PetWindow() {

    return (

        <div
            style={{
                width: "100vw",
                height: "100vh",
                background: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <Pet />

        </div>

    );

}