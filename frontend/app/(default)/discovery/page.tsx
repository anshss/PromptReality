"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import toast, { Toaster } from "react-hot-toast";
import { fetchAllAssets } from "../../../utils";

export default function FeaturesBlocks() {
    const [nftData, setNftData] = useState<any[]>([]);
    const { isLoaded, isSignedIn, user } = useUser();

    const [address, setAddress] = useState("");

    const [open, setOpen] = useState(false);
    const [nftAddress, setNftAddres] = useState("");

    function setNft(address: string) {
        setNftAddres(address);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        async function fetchInventory(email: string) {
            const data: any[] = await fetchAllAssets();
            return data;
        }

        if (user?.primaryEmailAddress?.emailAddress) {
            fetchInventory(user.primaryEmailAddress?.emailAddress).then(
                (data) => setNftData(data)
            );
        } else {
            if (isLoaded)
                toast.error("You are not logged in. Login to continue");
        }
    }, [user?.emailAddresses]);

    function handelClaim() {}

    console.log(nftData);

    return (
        <section className="relative">
            <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                        <h2 className="h2 mb-4">Explore</h2>
                        <p className="text-xl text-gray-600">
                            See all the NFTs minted by you below. You can claim
                            these by hitting the claim button and entering your
                            wallet address.
                        </p>
                    </div>

                    {/* Items */}
                    <div className="max-w-sm mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
                        {nftData.map((item) => (
                            <NftCard
                                nftData={item}
                                key={item.tokenId}
                                setopen={setNft}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-md">
                <Dialog fullWidth open={open} onClose={handleClose}>
                    <DialogTitle>Sell</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="address"
                            label="Recepient Address"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handelClaim}>Claim</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Toaster />
        </section>
    );
}

function NftCard({ nftData, setopen }: any) {
    function viewFunc() {
        alert(`cid: ${nftData.promptHash}`);
    }

    console.log(nftData);
    return (
        <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
            {/* <img
                src={imageUrl}
                className="w-full aspect-square "
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src =
                        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
                }}
            /> */}
            <div className="w-full aspect-square">
                <div>
                    URI:{" "}
                    <a href={nftData.uri} target="_blank">
                        View
                    </a>
                </div>
            </div>
            {/* <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 mt-3">
        Your NFT
      </h4> */}
            <p className="text-gray-600 text-ellipsis whitespace-nowrap overflow-hidden w-full mt-2">
                NFT ID: {nftData.tokenId}
            </p>
            <div className="w-full">
                <button
                    onClick={() => setopen(nftData.tokenId)}
                    className="p-1 px-8 text-white bg-blue-600 hover:bg-blue-700 mt-2 rounded-md text-sm"
                >
                    Like
                </button>
                {/* {nftData.claimed ? (
                    <div className="p-1 px-8 text-white bg-blue-600 hover:bg-blue-700 mt-2 rounded-md text-sm inline-block">
                        Already Claimed
                    </div>
                ) : (
                    <button
                        onClick={() => setopen(nftData.tokenId)}
                        className="p-1 px-8 text-white bg-blue-600 hover:bg-blue-700 mt-2 rounded-md text-sm"
                    >
                        Claim
                    </button>
                )} */}
            </div>
        </div>
    );
}
