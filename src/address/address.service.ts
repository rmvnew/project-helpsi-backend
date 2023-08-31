import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {


  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) { }


  async create(createAddressDto: CreateAddressDto) {

    const address = this.addressRepository.create(createAddressDto)

    return this.addressRepository.save(address)
  }

  async findOne(id: string) {

    return this.addressRepository.findOne({
      where: {
        address_id: id
      }
    })



  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {

    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException(`O endereço não foi encontrado!`)
    }

    const address = await this.addressRepository.preload({
      address_id: id,
      ...updateAddressDto
    })

    return this.addressRepository.save(address)
  }

  async remove(id: string) {

    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException(`O endereço não foi encontrado!`)
    }

    this.addressRepository.delete(isRegistered)

  }
}
