import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { CreateIaDto } from './dto/create-ia.dto';

@Injectable()
export class IaService {
  create(createIaDto: CreateIaDto) {
    return 'This action adds a new ia';
  }

  // minerarDados(): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     exec('/home/darthmorphus/Downloads/mineracao.py', (error, stdout, stderr) => {
  //       if (error) {
  //         reject(error);
  //         return;
  //       }
  //       resolve(stdout);
  //     });
  //   });
  // }

  minerarDados(): Promise<string> {
    return new Promise((resolve, reject) => {
      exec('/home/darthmorphus/Downloads/mineracao.py', (error, stdout, stderr) => {
        if (error) {
          console.error("Erro ao executar o script:", error);  // Exibe erros no console
          reject(error);
          return;
        }

        console.log("Saída do Script Python:", stdout);  // Exibe a saída padrão do script no console

        if (stderr) {
          console.error("Erro do Script Python:", stderr);  // Exibe a saída de erro do script (se houver) no console
        }

        resolve(stdout);
      });
    });
  }
}




