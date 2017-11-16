# Ceph分布式文件系统-单节点对象存储测试系统搭建

## 环境

* Ubuntu 14.04 LTS server版

## 步骤(请使用root账号)

1.关闭防火墙（测试环境，正式环境打开相应端口权限）,

```
    ufw disable
```

2.修改ssh配置

```
    vi /etc/ssh/sshd_config
    //修改
    PasswordAuthentication yes
    //添加
    PermitRootLogin yes
    sudo service ssh restart
```

4.添加ceph源

```
    wget -q -O- 'http://mirrors.163.com/ceph/keys/release.asc' | sudo apt-key add -
    echo deb http://mirrors.163.com/ceph/debian-infernalis/ $(lsb_release -sc) main | sudo tee /etc/apt/sources.list.d/ceph.list
    apt-get update
```

3.修改hosts文件

```
    vi /etc/hosts
    // 写入
    172.16.114.133   ceph-node1
```

4.配置ssh免密登录

```
    ssh-copy-id ceph-node1
    //或者 cat id_rsa.pub >> authorized_keys
```

5.安装ceph-deploy

```
    apt-get install ceph-deploy
```

6.安装ceph依赖

```
    apt-get install ceph ceph-mds
    // 如果安装出错执行下面命令
    // dpkg -i --force-overwrite /var/cache/apt/archives/ceph-base_10.2.10-1trusty_amd64.deb
```

7.创建ceph工作目录

```
    mkdir /opt/ceph-cluster
```

8.设置集群的monitor节点

```
    ceph-deploy new ceph-node1
```

9.修改ceph配置文件，在`7`步骤中创建的`ceph工作目录`中

```
    vi  ceph.conf
```
填入一下配置
```
    osd pool default size = 1 // 默认值3
    osd max object name len = 256
    osd max object namespace len = 64 //或者将文件系统改为XFS
    osd crush chooseleaf type = 0  //  单节点时设置
    osd pool default min size = 1 // 单节点设置，只会对后来创建的pool起作用
```

10.安装ceph

```
    ceph-deploy install --no-adjust-repos  ceph-node1
```

11.测试是否安装成功

```
    ceph --version
    ceph -s  // 或 ceph health
```

12.获取秘钥key，会在ceph-cluster下生成几个key

```
    ceph-deploy mon create-initial
```

13.创建数据目录

```
    mkdir  /var/local/osdn
    chown -R ceph:ceph /var/local/osdn
```

14.推送配置文件

```
    ceph-deploy admin ceph-node1
```

15.给admin key赋权限

```
    chmod +r /etc/ceph/ceph.client.admin.keyring
```

16.添加osd 激活osd

```
    ceph-deploy  osd prepare ceph-node1:/var/local/osdn
    ceph-deploy  osd activate ceph-node1:/var/local/osdn
```

17.安装对象存储服务网关

```
    ceph-deploy install --rgw ceph-node1
    ceph-deploy admin ceph-node1
    ceph-deploy rgw create ceph-node1
```

18.创建用户（需要记录下access_key和secret_key,端口默认7480）

```
    sudo radosgw-admin user create --uid="ubuntu" --display-name="ubuntu"
```
输出如下:

```
    {
        "user_id": "ubuntu",
        "display_name": "ubuntu",
        "email": "",
        "suspended": 0,
        "max_buckets": 1000,
        "auid": 0,
        "subusers": [],
        "keys": [
            {
                "user": "ubuntu",
                "access_key": "2B2F8CAWWJ79MMRJ6E2H",
                "secret_key": "JwXE43NfAVuNVqzvssalBMBWQH45wpZfGnllzinQ"
            }
        ],
        "swift_keys": [],
        "caps": [],
        "op_mask": "read, write, delete",
        "default_placement": "",
        "placement_tags": [],
        "bucket_quota": {
            "enabled": false,
            "max_size_kb": -1,
            "max_objects": -1
        },
        "user_quota": {
            "enabled": false,
            "max_size_kb": -1,
            "max_objects": -1
        },
        "temp_url_keys": []
    }
```

19.设置账户的用户权限，允许其读取修改users的信息

```
    radosgw-admin caps add --uid=ubuntu --caps="users=*"
```

20.添加ubuntu用户对所有usage信息的读写权限

```
    radosgw-admin caps add --uid=ubuntu --caps="usage=read,write"
```

21.测试对象存储

```
    wget http://ceph-node1:7480
```

## 错误补救

如果安装过程中出现异常想重新安装或修改命令顺序可以执行以下命令

```
    //remove所有节点上的ceph
    ceph-deploy purge ceph-node1
    //清除所有数据
    ceph-deploy purgedata ceph-node1
    //清除所有秘钥文件
    ceph-deploy forgetkeys
```

## 相关运维命令(待补全)

```
    //查看osd
    ceph osd tree
```

## 参考链接

* [官方中文文档](http://docs.ceph.org.cn/)
* [运维手册-gitbook](https://www.gitbook.com/book/lihaijing/ceph-handbook/details)
* [单节点安装](https://my.oschina.net/u/2604795/blog/754646)