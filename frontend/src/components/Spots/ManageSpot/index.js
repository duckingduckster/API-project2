import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function MangeSpot() {
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector((state) => state.session.user)
}
