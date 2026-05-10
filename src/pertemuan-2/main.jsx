import { createRoot } from "react-dom/client";
import HelloWorld from "./HelloWorld";
import QuoteText from "./QuoteText";
import Container from "./Container";
import "./Custom.css";
createRoot(document.getElementById("root"))
    .render(
        <div>
            <Container>
                <img src="img/pemandangan.jpg" alt="gambar" width = "100%" />
                <HelloWorld/>
                <QuoteText/>
            </Container>
            

        </div>

    )