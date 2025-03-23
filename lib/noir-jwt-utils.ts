// import jsonwebtoken from 'jsonwebtoken';
// import {generateInputs} from 'noir-jwt';
// import {createPrivateKey, createPublicKey} from './helpers/crypto-helper';
// // import fs from 'fs'

// // const key =  crypto.generateKeyPairSync("rsa", {
// //   modulusLength: 2048,
// //   publicExponent: 65537,
// // });

// // console.log(key.privateKey.export({ type: "pkcs8", format: "pem" }));
// // console.log(key.publicKey.export({ type: "spki", format: "pem" }));

// const privateKeyPem = `-----BEGIN PRIVATE KEY-----
// MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCjm55on1OLp1Ur
// 4B/N4+OKz6YL22jpjUmJzC81ghS4YQg8pb+DjUR734F6LGXLHqBuLvP5cjq5zRv3
// uLWfrhj/FGDKdkk5QGRcHbF6bbwlFnfv4BpojF5Dg7SiPBa+12pva3gB99nvoT/r
// q1nTGGP57DaAO7EtiFIOl+hGzPK3B3byk1xek8m4BQ9mEC/ZDrCHlDyn9wcWEsNu
// vV8qlFeLbKmcWSDScKJHEFeYlyWAZGxr56hvEgA9hqomJ61VDHzqBG7kI4PYolzO
// vORKnhsYTFminBnndABfnifxSFVCg+FFhLioBaAyZ452hIRX7ASQXV4L9w7ayZpI
// 4uNJ508fAgMBAAECggEAEc842S6uy371mIcXLzRlapDcBGJn8zR8EtH1OZ/lXYTC
// fseUJ1/TWqCj2YbHteqpkBTwXfD/T4ZySu8CZlVvRyUSvDdQFTlbM2PQFAGp/2eI
// usXsWgEdqb/Gg/qCh1evsF1EfQJb6Ofmq2LFrmLzTxtVe3QD/27db9U9ZaedrCqp
// S6Ar7abI3Zo3bc+N6PKJEnN9Du+kj9nofi2dVjrlr/RFE+zx+7yq0aO+IpmRIP34
// WOvRzTGOWtvBYAWmy4F8E4RsDJuV/coQJZ67udu9uhbzedIlZpnpjEdGdLSFwiO0
// LPKr3BW/iNmE4kBfnWPO2XeKrz+tld7a4Q2hrvEDEQKBgQDNp3wJB+KrEb5G3io5
// mpZfLBaf1R4NE9c2QfstdiBJ3DdqjhBgpSaAQ5mKcspnqy0G1chk8UYaP++nIrZT
// 8+6iPDHBd8vBwW4xjsWsQ+mjJ0oxPqTLjw7YRf3vPpHK99IzROG/t7/Yb99SMnNt
// 9oabx1UYsUqJo/9I72H2DsRQLQKBgQDLqQ5MdIWuUTEAFD4/bi4uAvq5OpmxwWiJ
// zHDTVZD6tPN4CIq1rJWdKHoJ/tcDpOBdX22cBJoI/70vOyuh0xNkFKZpWWislRWr
// Xm+ZUt74fFwHNJywkfqAp/xrFKSCcfiTfxAtBAXraFo9taHHTKz0VImFfMBMdgDD
// dzKZq9xf+wKBgQC/1aSZE/b3loSEvMZsl2v/eTPdgkIW9tQA88lmndL+suIqjjxu
// un9QlD5MbEmsLHvC7XaR2pKG9+8IXBPx+hA226maC7JQmau9pK11xJ/TJlpJ12KH
// 03mIermmCxqaV1OHqZBfcvsM3UZW+WK9R4JHG8igUPjzrbv7f/lEOoAbPQKBgDw3
// GtwuI4xbwyIj2hfFCvBdvyXfFqxA5BjCEqXZickmkUnvNJvskDvsSNEFwSr5p8DT
// w0O69JQukRAS7Z6mGvifRmiln9ZPKh4GCPcLUpOjqU4UFzP5pVg+0toSO2W6LuXl
// TrIQm3Nz4iKWvmN/3y9Kg3KtZOn2hdlFN/fJoZnbAoGBAJaTIliqJIvO5+L3auyZ
// abJ8id/nLZxAYpdCvzj1OaBHHjdrnwICTes8QNvcgcNIKdOkNjPVoGjTKXTdyBZJ
// g220hxOl6PTarDEwxCAxkWEZkN/mGITN4SkLyAQe5CMKGQWczx9rsnhlcj37YLJX
// KkhEi0T+msAtTMLLYFeKaEGD
// -----END PRIVATE KEY-----`;

// const publicKeyPem = `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo5ueaJ9Ti6dVK+AfzePj
// is+mC9to6Y1JicwvNYIUuGEIPKW/g41Ee9+Beixlyx6gbi7z+XI6uc0b97i1n64Y
// /xRgynZJOUBkXB2xem28JRZ37+AaaIxeQ4O0ojwWvtdqb2t4AffZ76E/66tZ0xhj
// +ew2gDuxLYhSDpfoRszytwd28pNcXpPJuAUPZhAv2Q6wh5Q8p/cHFhLDbr1fKpRX
// i2ypnFkg0nCiRxBXmJclgGRsa+eobxIAPYaqJietVQx86gRu5COD2KJczrzkSp4b
// GExZopwZ53QAX54n8UhVQoPhRYS4qAWgMmeOdoSEV+wEkF1eC/cO2smaSOLjSedP
// HwIDAQAB
// -----END PUBLIC KEY-----`;

// const nonce = '123123123';
// const email = 'alice@test.com';

// export async function createKeyAndSignData() {
//   // Generate a key pair using RSASSA-PKCS1-v1_5
//   const privateKey = createPrivateKey(privateKeyPem);

//   const publicKey = createPublicKey(publicKeyPem);

//   // Sample payload
//   const payload = {
//     iss: 'https://vicinity.com',
//     user_verified: true,
//     sub: 'vicinity',
//     nonce,
//     email,
//     iat: 1737642217,
//     aud: '123123123.456456456',
//     exp: 1799999999, // 2027-01-15T07:59:59.000Z
//   };

//   // Sign the payload
//   const jwt = jsonwebtoken.sign(payload, privateKey, {
//     algorithm: 'RS256',
//   });

//   // Verify the jwt
//   jsonwebtoken.verify(jwt, publicKey);

//   // Convert public key to JWK
//   const pubkeyJwk = publicKey.export({format: 'jwk'});

//   return {
//     pubkeyJwk,
//     jwt,
//     payload,
//   };
// }

// async function generateNoirTestDataPartialHash() {
//   const {pubkeyJwk, jwt} = await createKeyAndSignData();

//   // Prepare inputs
//   const inputs = await generateInputs({
//     jwt: jwt,
//     pubkey: pubkeyJwk as JsonWebKey,
//     shaPrecomputeTillKeys: ['nonce', 'email'],
//     maxSignedDataLength: 256,
//   });

//   console.log('Pubkey modulus limbs', inputs.pubkey_modulus_limbs);
//   console.log('redc_params_limbs', inputs.redc_params_limbs);
//   console.log('signature limbs', inputs.signature_limbs);
//   console.log('partial hash', inputs.partial_hash);
//   console.log(
//     'inputs data',
//     fs.writeFileSync('data.json', JSON.stringify(inputs.partial_data?.storage)),
//   );

//   return `
//       let pubkey_modulus_limbs = [${inputs.pubkey_modulus_limbs.join(', ')}];
//       let redc_params_limbs = [${inputs.redc_params_limbs.join(', ')}];
//       let signature_limbs = [${inputs.signature_limbs.join(', ')}];
//       let partial_data: BoundedVec<u8, 256> = BoundedVec::from_array([${inputs
//         .partial_data!.storage.filter(s => s !== 0)
//         .join(', ')}]);
//       let base64_decode_offset = ${inputs.base64_decode_offset};
//       let partial_hash = [${inputs.partial_hash!.join(', ')}];
//       let full_data_length = ${inputs.full_data_length};

//       let jwt = JWT::init_with_partial_hash(
//         partial_data,
//         partial_hash,
//         full_data_length,
//         base64_decode_offset,
//         pubkey_modulus_limbs,
//         redc_params_limbs,
//         signature_limbs,
//       );

//       jwt.verify();
//     `;
// }

// generateNoirTestDataPartialHash().then(console.log).catch(console.error);

/**
 * 
 * // const nonce = '123123123';
// const email = 'alice@test.com';
 * const payload = {
//     iss: 'https://vicinity.com',
//     user_verified: true,
//     sub: 'vicinity',
//     nonce,
//     email,
//     iat: 1737642217,
//     aud: '123123123.456456456',
//     exp: 1799999999, // 2027-01-15T07:59:59.000Z
//   };
 * JWT components are generated for above payload
 */

export const pubkey_modulus_limbs = [
  '484791102317025465533947056954494751',
  '689128460766062759582134715581990032',
  '810523707777777878428965619663888709',
  '184404549238669475316963116864788898',
  '93466218048229154672139102341852900',
  '584828628768888069086079532464056431',
  '97425187031931427039620311245463762',
  '26273806718910063326353308419294998',
  '788747954066548540615875263034804664',
  '889704621954975151388848797463892494',
  '311999144542197118282319553447935979',
  '569776388981460921496753063185331362',
  '903966640703701959992132828577771898',
  '159022820921763067563807580152706463',
  '503819859541011037194389727017199051',
  '1078173269124751507098806957834900664',
  '808018922828293630146825008649069450',
  '163',
];

export const redc_params_limbs = [
  '1143167338325541577958669340190596824',
  '782066667103526839077340987159104121',
  '1067845759344375818181746341911682002',
  '880124617802511701465844415806808588',
  '285259139341669707856057706066903101',
  '1230850420220071595120007854793337041',
  '243441877489860292941608721967510056',
  '821283804950244931298352888469271304',
  '265590023859021620015146340457966193',
  '955602690275722281613949658760787989',
  '704159826142581942518373637894303280',
  '313938418637521056314346970388282852',
  '296174013877567499290252280618882959',
  '127533166408087917092441034792304239',
  '486694435757811118946661778147879193',
  '742440511645057019411661928820777129',
  '106100992772450627263374716203348785',
  '6409',
];

export const signature_limbs = [
  '833613266825079867850081727410753015',
  '790606680797680199296852460795875773',
  '563934171158377689808136729287073804',
  '674113859318986969914676192464715922',
  '1047023061108530000091952893958882503',
  '415174839849618559240973497098882284',
  '1162872545590288893176084373554266102',
  '324908662432249590028094352038733607',
  '853053422047803192435448435451961178',
  '421204051349678967772134421844748619',
  '468463346052160085353964046449536708',
  '613346013323729914898819072857859262',
  '1269088170087101235057367830604347939',
  '9473128136863289056840880188589176',
  '611506242346263038221868432653412766',
  '668228485702136570642781360951670805',
  '278495101576030661434240510454573027',
  '162',
];

export const base64_decode_offset = 1;
export const full_data_length = 271;
export const partial_hash = [
  1916642836, 3267485219, 1129953402, 3538784050, 2686088690, 3583955613,
  3401313240, 1968336114,
];

export const partial_data = [
  117, 97, 88, 82, 53, 76, 109, 78, 118, 98, 83, 73, 115, 73, 110, 86, 122, 90,
  88, 74, 102, 100, 109, 86, 121, 97, 87, 90, 112, 90, 87, 81, 105, 79, 110, 82,
  121, 100, 87, 85, 115, 73, 110, 78, 49, 89, 105, 73, 54, 73, 110, 90, 112, 89,
  50, 108, 117, 97, 88, 82, 53, 73, 105, 119, 105, 98, 109, 57, 117, 89, 50, 85,
  105, 79, 105, 73, 120, 77, 106, 77, 120, 77, 106, 77, 120, 77, 106, 77, 105,
  76, 67, 74, 108, 98, 87, 70, 112, 98, 67, 73, 54, 73, 109, 70, 115, 97, 87,
  78, 108, 81, 72, 82, 108, 99, 51, 81, 117, 89, 50, 57, 116, 73, 105, 119, 105,
  97, 87, 70, 48, 73, 106, 111, 120, 78, 122, 77, 51, 78, 106, 81, 121, 77, 106,
  69, 51, 76, 67, 74, 104, 100, 87, 81, 105, 79, 105, 73, 120, 77, 106, 77, 120,
  77, 106, 77, 120, 77, 106, 77, 117, 78, 68, 85, 50, 78, 68, 85, 50, 78, 68,
  85, 50, 73, 105, 119, 105, 90, 88, 104, 119, 73, 106, 111, 120, 78, 122, 107,
  53, 79, 84, 107, 53, 79, 84, 107, 53, 102, 81, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
