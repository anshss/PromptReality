import express, { json } from "express";
import cors from "cors";
import { fetchURI, updateContractAddress } from "./function.js";

const app = express();
const port = 3080;

app.use(json());

app.use(cors({ origin: true }));

let emailList = [];
let communicationContract = "";
let latestGeneration = [];

app.post("/updateContract", (req, res) => {
    const contract_address = req.body.contract_address;
    if (contract_address) {
        updateContractAddress(contract_address);
        communicationContract = contract_address;
        console.log("Contract link updated");
        return res.status(200).json({ message: "Contract link updated" });
    } else {
        return res.status(400).json({ message: "Failed" });
    }
});

app.post("/create", (req, res) => {
    const email = req.body.email;
    const user_address = req.body.user_address;
    const contract_address = req.body.contract_address;
    if ((email, user_address, contract_address)) {
        const user = emailList.find(
            (user) =>
                user.email === email &&
                user.contract_address === contract_address
        );
        if (user) {
            console.log("User already exist");
            res.status(200).json({ message: "User already exist" });
        } else {
            let obj = {
                email: email,
                user_address: user_address,
                contract_address: contract_address,
                main_url: "",
            };
            emailList.push(obj);
            console.log("User added successfully");
            res.status(200).json({
                message: "User added successfully",
                emails: emailList,
            });
        }
    } else {
        res.status(400).json({ message: "Failed" });
    }
});

app.post("/syncPin/:contract_address/:email", async (req, res) => {
    const { contract_address, email } = req.params;
    const user = emailList.find(
        (user) =>
            user.email === email && user.contract_address === contract_address
    );
    if (user) {
        try {
            const uri = await fetchURI(user.user_address);
            console.log("uri: ", uri);
            user.main_url = uri;
            console.log(`Pin Synced for ${email}`);
            res.status(200).json({ message: "Pin Synced" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Request failed" });
        }
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

app.get("/fetchMain/:email", (req, res) => {
    const { email } = req.params;
    const user = emailList.find(
        (user) =>
            user.email === email &&
            user.contract_address === communicationContract
    );
    if (user) {
        const obj = {
            pin_url: user.main_url,
        };
        return res.status(200).json(obj);
    }
    res.status(404).json({ error: "User not found" });
});

app.post("/updateLatestGeneration", (req, res) => {
    const generation = req.body.generation;
    const email = req.body.email;
    if (generation) {
        const userGeneration = latestGeneration.find(
            (gen) => gen.email === email
        );
        if (userGeneration) {
            userGeneration.generation = generation;
            console.log("Latest generation updated");
            return res
                .status(200)
                .json({ message: "Latest generation updated" });
        } else {
            latestGeneration.push({ email: email, generation: generation });
            console.log("Latest generation updated");
            return res
                .status(200)
                .json({ message: "Latest generation updated" });
        }
    } else {
        return res.status(400).json({ message: "Failed" });
    }
});

app.get("/latestGeneration/:email", (req, res) => {
    const { email } = req.params;
    const userGeneration = latestGeneration.find((gen) => gen.email === email);
    if (userGeneration) {
        return res.status(200).json(userGeneration);
    }
    res.status(404).json({ error: "User not found" });
});

app.get("/view", (req, res) => {
    let obj = {
        emailList: emailList,
        latestGeneration: latestGeneration,
        communicationContract: communicationContract

    };
    res.status(200).json(obj);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
