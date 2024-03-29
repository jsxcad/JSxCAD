const $$PCB = () => {
  const $0 = Square(90, 84);
  const $1 = $0.extrude(2, 0, { twist: 0, steps: 1 });
  const $2 = $1.color("Green");
  const $3 = $2.bom({"BOMitemName":"PCBA Service","numberNeeded":1,"costUSD":4,"source":"https://macrofab.com/","totalNeeded":0});
  return $3;
};

const $$PCB = () => {
  const $0 = Square(90, 84);
  const $1 = $0.extrude(2, 0, { twist: 0, steps: 1 });
  const $2 = $1.color("Green");
  const $3 = $2.bom({"BOMitemName":"PCBA Service","numberNeeded":1,"costUSD":4,"source":"https://macrofab.com/","totalNeeded":0});
  return $3;
};

const $$ESP32 = () => {
  const $0 = $$ESP32();
  const $1 = $0.rotate(0, -180, -90);
  const $2 = $$SMD_Female_Header();
  const $3 = $2.rotate(0, 0, 90);
  const $4 = $3.move(0, 13, -11);
  const $5 = $3.move(0, -13, -11);
  const $6 = assemble($1, $4, $5);
  return $6;
};

const $$ESP32 = () => {
  const $0 = $$ESP32();
  const $1 = $0.rotate(0, -180, -90);
  const $2 = $$SMD_Female_Header();
  const $3 = $2.rotate(0, 0, 90);
  const $4 = $3.move(0, 13, -11);
  const $5 = $3.move(0, -13, -11);
  const $6 = assemble($1, $4, $5);
  return $6;
};

const $$Voltage_Regulator = () => {
  const $0 = Square(6.22, 6.73);
  const $1 = $0.extrude(2.38, 0, { twist: 0, steps: 1 });
  const $2 = $1.color("Steel blue");
  const $3 = $2.move(-30, 0, 2);
  const $4 = $3.bom({"BOMitemName":"7805 Voltage Regulator","numberNeeded":1,"costUSD":0.21,"source":"https://www.digikey.com/product-detail/en/on-semiconductor/MC7805BDTRKG/MC7805BDTRKGOSTR-ND/919331","totalNeeded":0});
  return $4;
};

const $$SPI_Motor_Controller = () => {
  const $0 = Square(10, 10);
  const $1 = $0.extrude(2, 0, { twist: 0, steps: 1 });
  const $2 = $1.move(6, 0, 2);
  const $3 = $2.color("Steel blue");
  const $4 = $3.bom({"BOMitemName":"TLC59711","numberNeeded":1,"costUSD":1.46,"source":"https://www.digikey.com/product-detail/en/texas-instruments/TLC59711PWPR/296-36745-2-ND/2962067","totalNeeded":0});
  return $4;
};

const $$Misc_Chips = () => {
  const $0 = $$Voltage_Regulator();
  const $1 = $$SPI_Motor_Controller();
  const $2 = assemble($0, $1);
  return $2;
};

const $$Voltage_Regulator = () => {
  const $0 = Square(6.22, 6.73);
  const $1 = $0.extrude(2.38, 0, { twist: 0, steps: 1 });
  const $2 = $1.color("Steel blue");
  const $3 = $2.move(-30, 0, 2);
  const $4 = $3.bom({"BOMitemName":"7805 Voltage Regulator","numberNeeded":1,"costUSD":0.21,"source":"https://www.digikey.com/product-detail/en/on-semiconductor/MC7805BDTRKG/MC7805BDTRKGOSTR-ND/919331","totalNeeded":0});
  return $4;
};

const $$SPI_Motor_Controller = () => {
  const $0 = Square(10, 10);
  const $1 = $0.extrude(2, 0, { twist: 0, steps: 1 });
  const $2 = $1.move(6, 0, 2);
  const $3 = $2.color("Steel blue");
  const $4 = $3.bom({"BOMitemName":"TLC59711","numberNeeded":1,"costUSD":1.46,"source":"https://www.digikey.com/product-detail/en/texas-instruments/TLC59711PWPR/296-36745-2-ND/2962067","totalNeeded":0});
  return $4;
};

const $$Misc_Chips = () => {
  const $0 = $$Voltage_Regulator();
  const $1 = $$SPI_Motor_Controller();
  const $2 = assemble($0, $1);
  return $2;
};

const $$0805_package = () => {
  const $0 = Square(2, 1.25);
  const $1 = $0.extrude(1, 0, { twist: 0, steps: 1 });
  return $1;
};

const $$0805_Parts = () => {
  const $0 = $$0805_package();
  const $1 = $0.bom({"BOMitemName":"10k Resistor","numberNeeded":1,"costUSD":0.00958,"source":"https://www.digikey.com/product-detail/en/stackpole-electronics-inc/RNCP0805FTD10K0/RNCP0805FTD10K0TR-ND/2240262","totalNeeded":0});
  const $2 = $1.move(3, 17, 0);
  const $3 = $0.bom({"BOMitemName":".1uF (100nF) Capacitor","numberNeeded":1,"costUSD":0.00729,"source":"https://www.digikey.com/product-detail/en/samsung-electro-mechanics/CL21F104ZBCNNNC/1276-1007-2-ND/3886665","totalNeeded":0});
  const $4 = $3.rotate(-6, 6, 90);
  const $5 = $4.move(8, 3, 0);
  const $6 = $0.bom({"BOMitemName":"1uF Capacitor","numberNeeded":1,"costUSD":0.015,"source":"https://www.digikey.com/product-detail/en/samsung-electro-mechanics/CL21B105KAFNNNE/1276-1066-2-ND/3886724","totalNeeded":0});
  const $7 = $6.move(5, 15, 0);
  const $8 = $0.bom({"BOMitemName":"47nF Capacitor","numberNeeded":1,"costUSD":0.02578,"source":"https://www.digikey.com/product-detail/en/kemet/C0805C473K5RACTU/399-1166-2-ND/411165","totalNeeded":0});
  const $9 = $8.move(6, 5, 0);
  const $10 = $3.move(-5, 5, 0);
  const $11 = $1.move(-5, 8, 0);
  const $12 = $3.move(-6, 10, 0);
  const $13 = assemble($2, $5, $7, $9, $10, $11, $12);
  return $13;
};

const $$1206_Parts = () => {
  const $0 = Square(3.2, 1.6);
  const $1 = $0.extrude(0.75, 0, { twist: 0, steps: 1 });
  const $2 = $1.bom({"BOMitemName":"1.5k Sense Resistor","numberNeeded":1,"costUSD":0.01107,"source":"https://www.digikey.com/product-detail/en/stackpole-electronics-inc/RNCP1206FTD1K50/RNCP1206FTD1K50TR-ND/2240341","totalNeeded":0});
  const $3 = $2.move(-3, 17, 0);
  const $4 = assemble($3);
  return $4;
};

const $$Large_Capacitor = () => {
  const $0 = Circle.ofDiameter(6.3, { sides: 32 });
  const $1 = $0.extrude(5.8, 0, { twist: 0, steps: 1 });
  const $2 = $1.bom({"BOMitemName":"22uF Capacitor","numberNeeded":1,"costUSD":0.0938,"source":"https://www.digikey.com/product-detail/en/panasonic-electronic-components/EEE-1HA220WP/PCE3920TR-ND/766087","totalNeeded":0});
  const $3 = $2.color("Powder blue");
  const $4 = $3.move(10, 8, 0);
  return $4;
};

const $$One_Motor_Driver = () => {
  const $0 = $$1206_Parts();
  const $1 = $$0805_Parts();
  const $2 = $$JST_XH_8_Place_Right_Angle();
  const $3 = $2.rotate(0, 0, 180);
  const $4 = $3.move(0, 0, 0);
  const $5 = $$DRV8873_H-Bridge();
  const $6 = $5.rotate(0, 0, 90);
  const $7 = $6.move(0, 10, 0);
  const $8 = $$Large_Capacitor();
  const $9 = assemble($0, $1, $4, $7, $8);
  return $9;
};

const $$Motor_Driver_Sub_Assembly = () => {
  const $0 = $$One_Motor_Driver();
  const $1 = $0.rotate(0, 0, 90);
  const $2 = $1.move(35, 0, 0);
  const $3 = $0.move(-15, Equation("-1*M", ), 0);
  const $4 = $0.move(15, Equation("-1*M", ), 0);
  const $5 = $0.rotate(0, 0, -180);
  const $6 = $5.move(-15, , 0);
  const $7 = $5.move(15, , 0);
  const $8 = assemble($2, $3, $4, $6, $7);
  const $9 = $8.move(0, 0, 2);
  return $9;
};

const $$0805_package = () => {
  const $0 = Square(2, 1.25);
  const $1 = $0.extrude(1, 0, { twist: 0, steps: 1 });
  return $1;
};

const $$0805_Parts = () => {
  const $0 = $$0805_package();
  const $1 = $0.bom({"BOMitemName":"10k Resistor","numberNeeded":1,"costUSD":0.00958,"source":"https://www.digikey.com/product-detail/en/stackpole-electronics-inc/RNCP0805FTD10K0/RNCP0805FTD10K0TR-ND/2240262","totalNeeded":0});
  const $2 = $1.move(3, 17, 0);
  const $3 = $0.bom({"BOMitemName":".1uF (100nF) Capacitor","numberNeeded":1,"costUSD":0.00729,"source":"https://www.digikey.com/product-detail/en/samsung-electro-mechanics/CL21F104ZBCNNNC/1276-1007-2-ND/3886665","totalNeeded":0});
  const $4 = $3.rotate(-6, 6, 90);
  const $5 = $4.move(8, 3, 0);
  const $6 = $0.bom({"BOMitemName":"1uF Capacitor","numberNeeded":1,"costUSD":0.015,"source":"https://www.digikey.com/product-detail/en/samsung-electro-mechanics/CL21B105KAFNNNE/1276-1066-2-ND/3886724","totalNeeded":0});
  const $7 = $6.move(5, 15, 0);
  const $8 = $0.bom({"BOMitemName":"47nF Capacitor","numberNeeded":1,"costUSD":0.02578,"source":"https://www.digikey.com/product-detail/en/kemet/C0805C473K5RACTU/399-1166-2-ND/411165","totalNeeded":0});
  const $9 = $8.move(6, 5, 0);
  const $10 = $3.move(-5, 5, 0);
  const $11 = $1.move(-5, 8, 0);
  const $12 = $3.move(-6, 10, 0);
  const $13 = assemble($2, $5, $7, $9, $10, $11, $12);
  return $13;
};

const $$1206_Parts = () => {
  const $0 = Square(3.2, 1.6);
  const $1 = $0.extrude(0.75, 0, { twist: 0, steps: 1 });
  const $2 = $1.bom({"BOMitemName":"1.5k Sense Resistor","numberNeeded":1,"costUSD":0.01107,"source":"https://www.digikey.com/product-detail/en/stackpole-electronics-inc/RNCP1206FTD1K50/RNCP1206FTD1K50TR-ND/2240341","totalNeeded":0});
  const $3 = $2.move(-3, 17, 0);
  const $4 = assemble($3);
  return $4;
};

const $$Large_Capacitor = () => {
  const $0 = Circle.ofDiameter(6.3, { sides: 32 });
  const $1 = $0.extrude(5.8, 0, { twist: 0, steps: 1 });
  const $2 = $1.bom({"BOMitemName":"22uF Capacitor","numberNeeded":1,"costUSD":0.0938,"source":"https://www.digikey.com/product-detail/en/panasonic-electronic-components/EEE-1HA220WP/PCE3920TR-ND/766087","totalNeeded":0});
  const $3 = $2.color("Powder blue");
  const $4 = $3.move(10, 8, 0);
  return $4;
};

const $$One_Motor_Driver = () => {
  const $0 = $$1206_Parts();
  const $1 = $$0805_Parts();
  const $2 = $$JST_XH_8_Place_Right_Angle();
  const $3 = $2.rotate(0, 0, 180);
  const $4 = $3.move(0, 0, 0);
  const $5 = $$DRV8873_H-Bridge();
  const $6 = $5.rotate(0, 0, 90);
  const $7 = $6.move(0, 10, 0);
  const $8 = $$Large_Capacitor();
  const $9 = assemble($0, $1, $4, $7, $8);
  return $9;
};

const $$Motor_Driver_Sub_Assembly = () => {
  const $0 = $$One_Motor_Driver();
  const $1 = $0.rotate(0, 0, 90);
  const $2 = $1.move(35, 0, 0);
  const $3 = $0.move(-15, Equation("-1*M", ), 0);
  const $4 = $0.move(15, Equation("-1*M", ), 0);
  const $5 = $0.rotate(0, 0, -180);
  const $6 = $5.move(-15, , 0);
  const $7 = $5.move(15, , 0);
  const $8 = assemble($2, $3, $4, $6, $7);
  const $9 = $8.move(0, 0, 2);
  return $9;
};

const $$Power_Jack = () => {
  const $0 = $$Maslow_4_Power_Plug();
  const $1 = $0.rotate(0, 0, 90);
  const $2 = $1.move(-35, 35, 2);
  return $2;
};

const $$Power_Jack = () => {
  const $0 = $$Maslow_4_Power_Plug();
  const $1 = $0.rotate(0, 0, 90);
  const $2 = $1.move(-35, 35, 2);
  return $2;
};

const $$Hardware_Stack = () => {
  const $0 = Circle.ofDiameter(9, { sides: 32 });
  const $1 = $0.extrude(30, 0, { twist: 0, steps: 1 });
  const $2 = $1.move(0, 0, 33);
  const $3 = $2.color("Keep Out");
  const $4 = $$45mm_M4_Bolt();
  const $5 = $4.move(0, 0, 33);
  const $6 = $$M4_20mm_Spacer();
  const $7 = $$M4_Locknut();
  const $8 = $7.rotate(0, 180, 0);
  const $9 = $8.move(0, 0, -5);
  const $10 = assemble($3, $5, $6, $9);
  return $10;
};

const $$Mounting_Hardware = () => {
  const $0 = $$Hardware_Stack();
  const $1 = $0.move(34, -22, 2);
  const $2 = $0.move(-34, -22, 2);
  const $3 = $0.move(-34, 22, 2);
  const $4 = $0.move(34, 22, 0);
  const $5 = assemble($1, $2, $3, $4);
  return $5;
};

const $$Hardware_Stack = () => {
  const $0 = Circle.ofDiameter(9, { sides: 32 });
  const $1 = $0.extrude(30, 0, { twist: 0, steps: 1 });
  const $2 = $1.move(0, 0, 33);
  const $3 = $2.color("Keep Out");
  const $4 = $$45mm_M4_Bolt();
  const $5 = $4.move(0, 0, 33);
  const $6 = $$M4_Locknut();
  const $7 = $6.rotate(0, 180, 0);
  const $8 = $7.move(0, 0, -5);
  const $9 = $$M4_25mm_Aluminum_Spacer_10mm_OD();
  const $10 = assemble($3, $5, $8, $9);
  return $10;
};

const $$Mounting_Hardware = () => {
  const $0 = $$Hardware_Stack();
  const $1 = $0.move(34, -22, 2);
  const $2 = $0.move(-34, -22, 2);
  const $3 = $0.move(-34, 22, 2);
  const $4 = $0.move(34, 22, 0);
  const $5 = assemble($1, $2, $3, $4);
  return $5;
};

const $$5_Motor_Controller_Board = () => {
  const $0 = $$ESP32();
  const $1 = $0.move(-11, 0, 13);
  const $2 = $$Power_Jack();
  const $3 = $$PCB();
  const $4 = $$Misc_Chips();
  const $5 = $$Motor_Driver_Sub_Assembly();
  const $6 = $$Mounting_Hardware();
  const $7 = assemble($1, $2, $3, $4, $5, $6);
  return $7;
};
