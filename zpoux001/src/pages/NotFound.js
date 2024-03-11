import React from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"; //書き換え
import { Button } from '@ui5/webcomponents-react';
export default function NotFound () {
  const navigate = useNavigate();
  const location = useLocation();

  const OpActyNtwkInstance = location.state.OpActyNtwkInstance;
  const OpActyNtwkElement = location.state.OpActyNtwkElement;
  const ShopFloorItem = location.state.ShopFloorItem;

  return (
    <>
      <h1>404</h1>
      <h1>存在しないページです</h1>
      <h1>OpActyNtwkInstance：{OpActyNtwkInstance}</h1>
      <h1>OpActyNtwkElement：{OpActyNtwkElement}</h1>
      <h1>ShopFloorItem：{ShopFloorItem}</h1>
      <Button onClick={(e) => {navigate("/");}} design="Emphasized">戻る</Button>
    </>
  )
}